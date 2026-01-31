
/**
 * 流式文本服务
 * 支持流式文本生成和传输
 */

import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

/**
 * 流式文本接口
 */
interface StreamText {
  id: string;
  chunks: string[];
  status: 'active' | 'paused' | 'completed' | 'cancelled' | 'error';
  metadata: Record<string, any>;
  createdAt: number;
  updatedAt: number;
  error?: Error;
}

/**
 * 流式文本事件
 */
type StreamEvents = {
  chunk: (chunk: string) => void;
  complete: () => void;
  error: (error: Error) => void;
  pause: () => void;
  resume: () => void;
  cancel: () => void;
};

class StreamingTextService {
  // 存储所有流式文本
  private streams: Map<string, StreamText> = new Map();

  // 流式文本事件发射器
  private emitters: Map<string, EventEmitter> = new Map();

  // 流式文本保留时间（1小时）
  private readonly RETENTION_TIME = 60 * 60 * 1000;

  // 最大流数量
  private readonly MAX_STREAMS = 1000;

  /**
   * 创建流式文本
   */
  createStream(id?: string): StreamText {
    const streamId = id || uuidv4();

    // 检查是否超过最大数量
    if (this.streams.size >= this.MAX_STREAMS) {
      this.cleanExpiredStreams();
    }

    const stream: StreamText = {
      id: streamId,
      chunks: [],
      status: 'active',
      metadata: {},
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.streams.set(streamId, stream);
    this.emitters.set(streamId, new EventEmitter());

    return stream;
  }

  /**
   * 写入文本片段
   */
  writeChunk(streamId: string, chunk: string): { success: boolean; message?: string } {
    const stream = this.streams.get(streamId);

    if (!stream) {
      return { success: false, message: '流不存在' };
    }

    if (stream.status !== 'active') {
      return { success: false, message: '流未激活' };
    }

    stream.chunks.push(chunk);
    stream.updatedAt = Date.now();

    // 触发事件
    const emitter = this.emitters.get(streamId);
    if (emitter) {
      emitter.emit('chunk', chunk);
    }

    return { success: true };
  }

  /**
   * 读取完整文本
   */
  readFullText(streamId: string): string | null {
    const stream = this.streams.get(streamId);
    return stream ? stream.chunks.join('') : null;
  }

  /**
   * 读取部分文本
   */
  readPartialText(streamId: string, start: number, end?: number): string | null {
    const stream = this.streams.get(streamId);
    if (!stream) return null;

    const fullText = stream.chunks.join('');
    return end ? fullText.substring(start, end) : fullText.substring(start);
  }

  /**
   * 完成流式文本
   */
  completeStream(streamId: string): void {
    const stream = this.streams.get(streamId);
    if (!stream) return;

    stream.status = 'completed';
    stream.updatedAt = Date.now();

    // 触发事件
    const emitter = this.emitters.get(streamId);
    if (emitter) {
      emitter.emit('complete');
    }
  }

  /**
   * 暂停流式文本
   */
  pauseStream(streamId: string): void {
    const stream = this.streams.get(streamId);
    if (!stream) return;

    stream.status = 'paused';
    stream.updatedAt = Date.now();

    // 触发事件
    const emitter = this.emitters.get(streamId);
    if (emitter) {
      emitter.emit('pause');
    }
  }

  /**
   * 恢复流式文本
   */
  resumeStream(streamId: string): void {
    const stream = this.streams.get(streamId);
    if (!stream) return;

    stream.status = 'active';
    stream.updatedAt = Date.now();

    // 触发事件
    const emitter = this.emitters.get(streamId);
    if (emitter) {
      emitter.emit('resume');
    }
  }

  /**
   * 取消流式文本
   */
  cancelStream(streamId: string): void {
    const stream = this.streams.get(streamId);
    if (!stream) return;

    stream.status = 'cancelled';
    stream.updatedAt = Date.now();

    // 触发事件
    const emitter = this.emitters.get(streamId);
    if (emitter) {
      emitter.emit('cancel');
    }
  }

  /**
   * 设置元数据
   */
  setMetadata(streamId: string, metadata: Record<string, any>): void {
    const stream = this.streams.get(streamId);
    if (!stream) return;

    stream.metadata = { ...stream.metadata, ...metadata };
    stream.updatedAt = Date.now();
  }

  /**
   * 获取统计信息
   */
  getStats(streamId: string): {
    charCount: number;
    byteCount: number;
    chunkCount: number;
    duration: number;
  } | null {
    const stream = this.streams.get(streamId);
    if (!stream) return null;

    const fullText = stream.chunks.join('');
    const blob = new Blob([fullText]);

    return {
      charCount: fullText.length,
      byteCount: blob.size,
      chunkCount: stream.chunks.length,
      duration: stream.updatedAt - stream.createdAt
    };
  }

  /**
   * 获取流式文本
   */
  getStream(streamId: string): StreamText | null {
    return this.streams.get(streamId) || null;
  }

  /**
   * 删除流式文本
   */
  deleteStream(streamId: string): { success: boolean; message?: string } {
    const stream = this.streams.get(streamId);

    if (!stream) {
      return { success: false, message: '流不存在' };
    }

    this.streams.delete(streamId);
    this.emitters.delete(streamId);

    return { success: true };
  }

  /**
   * 清理过期流式文本
   */
  cleanExpiredStreams(maxAge: number = this.RETENTION_TIME): number {
    const now = Date.now();
    const expiredIds: string[] = [];

    for (const [id, stream] of this.streams) {
      if (now - stream.createdAt > maxAge) {
        expiredIds.push(id);
      }
    }

    expiredIds.forEach(id => {
      this.streams.delete(id);
      this.emitters.delete(id);
    });

    return expiredIds.length;
  }

  /**
   * 获取所有流式文本
   */
  getAllStreams(): StreamText[] {
    return Array.from(this.streams.values());
  }

  /**
   * 获取流式文本数量
   */
  getStreamCount(): number {
    return this.streams.size;
  }

  /**
   * 清空所有流式文本
   */
  clear(): void {
    this.streams.clear();
    this.emitters.clear();
  }

  /**
   * 添加事件监听器
   */
  on<K extends keyof StreamEvents>(
    streamId: string,
    event: K,
    listener: StreamEvents[K]
  ): void {
    const emitter = this.emitters.get(streamId);
    if (emitter) {
      emitter.on(event, listener);
    }
  }

  /**
   * 移除事件监听器
   */
  off<K extends keyof StreamEvents>(
    streamId: string,
    event: K,
    listener: StreamEvents[K]
  ): void {
    const emitter = this.emitters.get(streamId);
    if (emitter) {
      emitter.off(event, listener);
    }
  }

  /**
   * 获取流式文本事件发射器
   */
  private getEmitter(streamId: string): EventEmitter | null {
    return this.emitters.get(streamId) || null;
  }
}

// 导出单例
export default new StreamingTextService();

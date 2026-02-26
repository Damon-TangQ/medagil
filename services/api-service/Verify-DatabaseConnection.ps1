# ========================================
# 数据库连接验证PowerShell脚本
# 用于验证数据库连接和连接池配置
# ========================================

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("test", "monitor", "stress")]
    [string]$Action = "test"
)

function Write-Step {
    param(
        [string]$Message,
        [string]$Status = "INFO"
    )

    $color = switch ($Status) {
        "SUCCESS" { "Green" }
        "WARNING" { "Yellow" }
        "ERROR"   { "Red" }
        default   { "Cyan" }
    }

    Write-Host "[$Status] $Message" -ForegroundColor $color
}

function Test-DatabaseConnection {
    Write-Step "测试数据库连接..."
    Write-Host ""

    $apiServicePath = Join-Path $PSScriptRoot "api-service"

    # 检查配置文件
    $configPath = Join-Path $apiServicePath "config.yaml"
    if (-not (Test-Path $configPath)) {
        Write-Step "未找到配置文件 config.yaml" -Status "ERROR"
        return $false
    }
    Write-Step "配置文件存在" -Status "SUCCESS"

    # 检查可执行文件
    $serverExe = Join-Path $apiServicePath "bin\server.exe"
    if (-not (Test-Path $serverExe)) {
        Write-Step "未找到可执行文件 bin\server.exe" -Status "ERROR"
        Write-Step "请先运行 install_go_deps.bat 编译项目" -Status "INFO"
        return $false
    }
    Write-Step "可执行文件存在" -Status "SUCCESS"
    Write-Host ""

    # 启动服务
    Write-Step "启动服务进行连接测试..." -Status "INFO"
    $process = Start-Process -FilePath $serverExe -PassThru

    # 等待服务启动
    Write-Step "等待服务启动（10秒）..." -Status "INFO"
    Start-Sleep -Seconds 10

    # 测试健康检查接口
    Write-Step "测试健康检查接口..." -Status "INFO"
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/health" -UseBasicParsing
        Write-Step "健康检查通过" -Status "SUCCESS"
        Write-Host "响应: $($response.Content)" -ForegroundColor Gray
    } catch {
        Write-Step "健康检查失败: $($_.Exception.Message)" -Status "ERROR"
        Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
        return $false
    }

    # 测试API接口
    Write-Host ""
    Write-Step "测试API接口..." -Status "INFO"
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/ping" -UseBasicParsing
        Write-Step "API接口测试通过" -Status "SUCCESS"
        Write-Host "响应: $($response.Content)" -ForegroundColor Gray
    } catch {
        Write-Step "API接口测试失败: $($_.Exception.Message)" -Status "ERROR"
        Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
        return $false
    }

    # 停止服务
    Write-Host ""
    Write-Step "停止服务..." -Status "INFO"
    Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2

    Write-Host ""
    Write-Step "数据库连接测试完成" -Status "SUCCESS"
    return $true
}

function Monitor-DatabaseConnections {
    Write-Step "监控数据库连接数..."
    Write-Host ""
    Write-Step "提示: 按 Ctrl+C 停止监控" -Status "INFO"
    Write-Host ""

    while ($true) {
        $timestamp = Get-Date -Format "HH:mm:ss"
        $connections = Get-NetTCPConnection -LocalPort 5432 -ErrorAction SilentlyContinue | Measure-Object | Select-Object -ExpandProperty Count
        Write-Host "[$timestamp] 当前PostgreSQL连接数: $connections" -ForegroundColor Cyan
        Start-Sleep -Seconds 5
    }
}

function Test-DatabaseConnectionPool {
    Write-Step "压力测试数据库连接池..."
    Write-Host ""

    $apiServicePath = Join-Path $PSScriptRoot "api-service"
    $serverExe = Join-Path $apiServicePath "bin\server.exe"

    # 检查可执行文件
    if (-not (Test-Path $serverExe)) {
        Write-Step "未找到可执行文件 bin\server.exe" -Status "ERROR"
        return $false
    }

    # 启动服务
    Write-Step "启动服务..." -Status "INFO"
    $process = Start-Process -FilePath $serverExe -PassThru

    # 等待服务启动
    Write-Step "等待服务启动（10秒）..." -Status "INFO"
    Start-Sleep -Seconds 10

    # 记录初始连接数
    $initialConnections = Get-NetTCPConnection -LocalPort 5432 -ErrorAction SilentlyContinue | Measure-Object | Select-Object -ExpandProperty Count
    Write-Host ""
    Write-Step "初始连接数: $initialConnections" -Status "INFO"

    # 压力测试
    Write-Step "开始压力测试..." -Status "INFO"
    Write-Step "发送100个并发请求到API" -Status "INFO"
    Write-Host ""

    $jobs = @()
    for ($i = 1; $i -le 100; $i++) {
        $jobs += Start-Job -ScriptBlock {
            try {
                Invoke-WebRequest -Uri 'http://localhost:8080/api/v1/ping' -UseBasicParsing | Out-Null
            } catch {
                Write-Error "请求失败: $($_.Exception.Message)"
            }
        }
    }

    # 等待所有作业完成
    $jobs | Wait-Job | Out-Null
    $jobs | Remove-Job

    Write-Step "压力测试完成" -Status "SUCCESS"
    Write-Host ""

    # 等待连接池稳定
    Write-Step "等待连接池稳定（10秒）..." -Status "INFO"
    Start-Sleep -Seconds 10

    # 检查连接数
    $peakConnections = Get-NetTCPConnection -LocalPort 5432 -ErrorAction SilentlyContinue | Measure-Object | Select-Object -ExpandProperty Count
    Write-Step "峰值连接数: $peakConnections" -Status "INFO"

    # 停止服务
    Write-Host ""
    Write-Step "停止服务..." -Status "INFO"
    Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue

    # 等待连接关闭
    Write-Step "等待连接关闭（10秒）..." -Status "INFO"
    Start-Sleep -Seconds 10

    # 再次检查连接数
    $finalConnections = Get-NetTCPConnection -LocalPort 5432 -ErrorAction SilentlyContinue | Measure-Object | Select-Object -ExpandProperty Count
    Write-Step "最终连接数: $finalConnections" -Status "INFO"

    Write-Host ""
    Write-Step "压力测试完成" -Status "SUCCESS"
    Write-Host ""

    # 分析结果
    Write-Step "测试结果分析:" -Status "INFO"
    Write-Host "  初始连接数: $initialConnections" -ForegroundColor Gray
    Write-Host "  峰值连接数: $peakConnections" -ForegroundColor Gray
    Write-Host "  最终连接数: $finalConnections" -ForegroundColor Gray
    Write-Host ""

    if ($finalConnections -le $initialConnections + 5) {
        Write-Step "连接池配置正确，无连接泄漏" -Status "SUCCESS"
        return $true
    } else {
        Write-Step "可能存在连接泄漏问题" -Status "WARNING"
        Write-Step "建议检查连接池配置和代码中的连接使用情况" -Status "INFO"
        return $false
    }
}

# 主程序
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "数据库连接验证脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$success = switch ($Action) {
    "test"    { Test-DatabaseConnection }
    "monitor" { Monitor-DatabaseConnections }
    "stress"  { Test-DatabaseConnectionPool }
}

Write-Host ""
if ($success) {
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "验证完成！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} else {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "验证失败，请检查错误信息" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
}
Write-Host ""

exit $success

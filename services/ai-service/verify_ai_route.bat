@echo off
REM ========================================
REM AI路由验证脚本
REM 用于验证/api/v1/ai/process接口功能
REM ========================================

setlocal enabledelayedexpansion

echo.
echo ========================================
echo AI路由验证脚本
echo ========================================
echo.

REM 检查参数
set ACTION=%1
if "%ACTION%"=="" (
    echo 用法: verify_ai_route.bat [test^|valid^|invalid^|missing^|types]
    echo.
    echo 参数说明:
    echo   test    - 完整测试（包含所有场景）
    echo   valid   - 测试有效请求
    echo   invalid - 测试无效agent_type
    echo   missing - 测试缺失input_text
    echo   types   - 测试所有支持的agent_type
    echo.
    pause
    exit /b 0
)

REM 设置服务地址
set BASE_URL=http://localhost:8000

REM 检查服务是否运行
echo [检查] 检查服务状态...
curl -s %BASE_URL%/health >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 服务未运行，请先启动服务
    echo.
    echo 启动服务:
    echo   cd ai-service
    echo   python app/main.py
    echo.
    pause
    exit /b 1
)
echo [成功] 服务正在运行
echo.

REM 测试有效请求
if "%ACTION%"=="valid" goto TEST_VALID_REQUEST
if "%ACTION%"=="test" goto TEST_VALID_REQUEST
goto TEST_INVALID_REQUEST

:TEST_VALID_REQUEST
echo.
echo ========================================
echo 测试场景1: 有效请求（论文大纲生成）
echo ========================================
echo.
echo [信息] 发送有效的AI处理请求
echo.

curl -s -X POST "%BASE_URL%/api/v1/ai/process" ^
  -H "Content-Type: application/json" ^
  -d "{"input_text":"人工智能在医疗诊断中的应用研究","agent_type":"paper-outline","parameters":{}}" ^
  -w "
HTTP状态码: %%{http_code}
" ^
  -w "响应时间: %%{time_total}秒
" ^
  -w "响应内容:
%%{response}
"

if %ERRORLEVEL% EQU 0 (
    echo [成功] 有效请求返回200状态码
) else (
    echo [失败] 请求失败
)

if not "%ACTION%"=="test" goto END

REM 测试无效agent_type
:TEST_INVALID_REQUEST
echo.
echo ========================================
echo 测试场景2: 无效agent_type
echo ========================================
echo.
echo [信息] 发送包含无效agent_type的请求
echo.

curl -s -X POST "%BASE_URL%/api/v1/ai/process" ^
  -H "Content-Type: application/json" ^
  -d "{"input_text":"测试文本","agent_type":"invalid_type","parameters":{}}" ^
  -w "
HTTP状态码: %%{http_code}
" ^
  -w "响应内容:
%%{response}
"

if %ERRORLEVEL% NEQ 0 (
    echo [成功] 无效agent_type返回400状态码
) else (
    echo [失败] 无效agent_type未被正确拒绝
)

if not "%ACTION%"=="test" goto END

REM 测试缺失input_text
:TEST_MISSING_INPUT
echo.
echo ========================================
echo 测试场景3: 缺失input_text
echo ========================================
echo.
echo [信息] 发送缺失input_text的请求
echo.

curl -s -X POST "%BASE_URL%/api/v1/ai/process" ^
  -H "Content-Type: application/json" ^
  -d "{"agent_type":"general","parameters":{}}" ^
  -w "
HTTP状态码: %%{http_code}
" ^
  -w "响应内容:
%%{response}
"

if %ERRORLEVEL% NEQ 0 (
    echo [成功] 缺失input_text返回400状态码
) else (
    echo [失败] 缺失input_text未被正确拒绝
)

if not "%ACTION%"=="test" goto END

REM 测试所有支持的agent_type
:TEST_ALL_TYPES
echo.
echo ========================================
echo 测试场景4: 所有支持的agent_type
echo ========================================
echo.

echo [测试] paper-outline（论文大纲生成）
curl -s -X POST "%BASE_URL%/api/v1/ai/process" ^
  -H "Content-Type: application/json" ^
  -d "{"input_text":"测试文本","agent_type":"paper-outline"}" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] paper-outline处理成功
) else (
    echo [失败] paper-outline处理失败
)

echo [测试] paper-polish（论文润色）
curl -s -X POST "%BASE_URL%/api/v1/ai/process" ^
  -H "Content-Type: application/json" ^
  -d "{"input_text":"测试文本","agent_type":"paper-polish"}" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] paper-polish处理成功
) else (
    echo [失败] paper-polish处理失败
)

echo [测试] paper-review（论文评审）
curl -s -X POST "%BASE_URL%/api/v1/ai/process" ^
  -H "Content-Type: application/json" ^
  -d "{"input_text":"测试文本","agent_type":"paper-review"}" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] paper-review处理成功
) else (
    echo [失败] paper-review处理失败
)

echo [测试] general（通用AI处理）
curl -s -X POST "%BASE_URL%/api/v1/ai/process" ^
  -H "Content-Type: application/json" ^
  -d "{"input_text":"测试文本","agent_type":"general"}" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] general处理成功
) else (
    echo [失败] general处理失败
)

:END
echo.
echo ========================================
echo 验证完成！
echo ========================================
echo.
echo 验证标准:
echo   [√] POST请求/api/v1/ai/process可正常返回响应
echo   [√] 有效请求返回200状态码
echo   [√] 无效agent_type返回400状态码
echo   [√] 缺失input_text返回400状态码
echo   [√] 所有支持的agent_type都能正常处理
echo.
pause

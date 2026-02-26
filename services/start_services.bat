@echo off
REM ========================================
REM 服务启动脚本
REM 用于启动api-service和ai-service
REM ========================================

setlocal enabledelayedexpansion

echo.
echo ========================================
echo Medagil服务启动脚本
echo ========================================
echo.

REM 检查参数
set SERVICE=%1
if "%SERVICE%"=="" (
    echo 用法: start_services.bat [api^|ai^|all]
    echo.
    echo 参数说明:
    echo   api  - 仅启动api-service
    echo   ai   - 仅启动ai-service
    echo   all  - 同时启动两个服务（默认）
    echo.
    pause
    exit /b 0
)

REM 启动api-service
if "%SERVICE%"=="api" goto START_API
if "%SERVICE%"=="all" goto START_API
goto START_AI

:START_API
echo.
echo [1/2] 启动api-service...
cd /d "%~dp0api-service"

REM 检查可执行文件是否存在
if not exist "bin\server.exe" (
    echo [错误] 未找到api-service可执行文件
    echo 请先运行 install_go_deps.bat 安装依赖
    pause
    exit /b 1
)

echo [信息] 启动api-service...
start "api-service" cmd /k "bin\server.exe"

if "%SERVICE%"=="api" (
    echo.
    echo [成功] api-service已启动
    echo.
    goto END
)

REM 等待api-service启动
echo [信息] 等待api-service启动...
timeout /t 3 /nobreak >nul

:START_AI
echo.
if "%SERVICE%"=="ai" (
    echo [1/1] 启动ai-service...
) else (
    echo [2/2] 启动ai-service...
)
cd /d "%~dp0ai-service"

REM 检查虚拟环境是否存在
if not exist "venv\Scriptsctivate.bat" (
    echo [错误] 未找到Python虚拟环境
    echo 请先运行 install_python_deps.bat 安装依赖
    pause
    exit /b 1
)

echo [信息] 激活虚拟环境并启动ai-service...
start "ai-service" cmd /k "venv\Scriptsctivate.bat && python app\main.py"

:END
echo.
echo ========================================
echo 服务启动完成！
echo ========================================
echo.
echo 服务窗口:
echo   - api-service: 端口 8080
echo   - ai-service: 端口 8000
echo.
echo 如需停止服务，请关闭对应的服务窗口
echo.
pause

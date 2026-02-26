@echo off
REM ========================================
REM 依赖验证脚本
REM 用于验证Go和Python依赖是否正确安装
REM ========================================

setlocal enabledelayedexpansion

echo.
echo ========================================
echo 依赖验证脚本
echo ========================================
echo.

set ALL_PASSED=1

REM 验证Go依赖
echo [验证] Go依赖...
echo.

cd /d "%~dp0api-service"

REM 检查Go是否安装
where go >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [失败] 未找到Go
    set ALL_PASSED=0
) else (
    echo [通过] Go已安装
    for /f "tokens=3" %%i in ('go version') do echo [信息] 版本: %%i
)

REM 检查go.mod
if exist "go.mod" (
    echo [通过] go.mod存在
) else (
    echo [失败] go.mod不存在
    set ALL_PASSED=0
)

REM 检查go.sum
if exist "go.sum" (
    echo [通过] go.sum存在
) else (
    echo [失败] go.sum不存在
    set ALL_PASSED=0
)

REM 检查bin目录
if exist "bin\server.exe" (
    echo [通过] api-service可执行文件存在
) else (
    echo [警告] api-service可执行文件不存在（可能需要编译）
)

REM 验证关键Go包
echo.
echo [验证] Go依赖包...
go list -m github.com/gin-gonic/gin >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [通过] github.com/gin-gonic/gin
) else (
    echo [失败] github.com/gin-gonic/gin
    set ALL_PASSED=0
)

go list -m github.com/spf13/viper >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [通过] github.com/spf13/viper
) else (
    echo [失败] github.com/spf13/viper
    set ALL_PASSED=0
)

go list -m gorm.io/gorm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [通过] gorm.io/gorm
) else (
    echo [失败] gorm.io/gorm
    set ALL_PASSED=0
)

go list -m gorm.io/driver/postgres >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [通过] gorm.io/driver/postgres
) else (
    echo [失败] gorm.io/driver/postgres
    set ALL_PASSED=0
)

echo.
echo ========================================
echo.

REM 验证Python依赖
echo [验证] Python依赖...
echo.

cd /d "%~dp0ai-service"

REM 检查Python是否安装
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [失败] 未找到Python
    set ALL_PASSED=0
) else (
    echo [通过] Python已安装
    for /f "tokens=2" %%i in ('python --version 2^>^&1') do echo [信息] 版本: %%i
)

REM 检查虚拟环境
if exist "venv\Scriptsctivate.bat" (
    echo [通过] Python虚拟环境存在
) else (
    echo [警告] Python虚拟环境不存在
)

REM 验证关键Python包
echo.
echo [验证] Python依赖包...

REM 激活虚拟环境
if exist "venv\Scriptsctivate.bat" (
    call venv\Scriptsctivate.bat
)

python -c "import fastapi" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "delims=" %%i in ('python -c "import fastapi; print(fastapi.__version__)"') do set FASTAPI_VER=%%i
    echo [通过] fastapi (!FASTAPI_VER!)
) else (
    echo [失败] fastapi
    set ALL_PASSED=0
)

python -c "import psycopg2" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "delims=" %%i in ('python -c "import psycopg2; print(psycopg2.__version__)"') do set PSYCOPG2_VER=%%i
    echo [通过] psycopg2-binary (!PSYCOPG2_VER!)
) else (
    echo [警告] psycopg2-binary（可能不影响使用）
)

python -c "import pydantic" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "delims=" %%i in ('python -c "import pydantic; print(pydantic.__version__)"') do set PYDANTIC_VER=%%i
    echo [通过] pydantic (!PYDANTIC_VER!)
) else (
    echo [失败] pydantic
    set ALL_PASSED=0
)

python -c "import uvicorn" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "delims=" %%i in ('python -c "import uvicorn; print(uvicorn.__version__)"') do set UVICORN_VER=%%i
    echo [通过] uvicorn (!UVICORN_VER!)
) else (
    echo [失败] uvicorn
    set ALL_PASSED=0
)

python -c "import requests" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "delims=" %%i in ('python -c "import requests; print(requests.__version__)"') do set REQUESTS_VER=%%i
    echo [通过] requests (!REQUESTS_VER!)
) else (
    echo [失败] requests
    set ALL_PASSED=0
)

echo.
echo ========================================
echo.

REM 显示验证结果
if %ALL_PASSED% EQU 1 (
    echo [成功] 所有核心依赖验证通过！
    echo.
    echo 您可以运行以下命令启动服务:
    echo   start_services.bat all
    echo.
) else (
    echo [警告] 部分依赖验证失败
    echo.
    echo 请运行以下命令安装缺失的依赖:
    echo   install_go_deps.bat
    echo   install_python_deps.bat
    echo.
)

pause

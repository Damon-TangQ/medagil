@echo off
REM ========================================
REM 项目编译脚本
REM 用于编译整个Medagil项目
REM ========================================

setlocal enabledelayedexpansion

echo.
echo ========================================
echo 项目编译脚本
echo ========================================
echo.

REM 检查Python是否安装
python --version >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [错误] Python未安装或未添加到PATH
    pause
    exit /b 1
)

echo [成功] Python已安装
echo.

REM 检查Go是否安装
go version >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [错误] Go未安装或未添加到PATH
    pause
    exit /b 1
)

echo [成功] Go已安装
echo.

echo ========================================
echo 编译AI Service
echo ========================================
echo.

cd servicesi-service

REM 检查pyproject.toml是否存在
if not exist "pyproject.toml" (
    echo [错误] pyproject.toml不存在
    cd ..\..
    pause
    exit /b 1
)

echo [信息] 检查Python依赖...
python -m py_compile app\main.py
if %ERRORLEVEL% NEQ 0 (
    echo [失败] Python代码编译失败
    cd ..\..
    pause
    exit /b 1
)

echo [成功] Python代码编译成功
echo.

cd ..\..

echo ========================================
echo 编译API Service
echo ========================================
echo.

cd servicespi-service

REM 检查go.mod是否存在
if not exist "go.mod" (
    echo [警告] go.mod不存在，尝试创建...
    go mod init github.com/medagil/api-service
    if %ERRORLEVEL% NEQ 0 (
        echo [失败] go.mod创建失败
        cd ..\..
        pause
        exit /b 1
    )
    echo [成功] go.mod创建成功
)

echo [信息] 下载Go依赖...
go mod download
if %ERRORLEVEL% NEQ 0 (
    echo [警告] Go依赖下载失败，继续编译...
)

echo [信息] 编译Go代码...
go build -o bin\server.exe .\cmd\server
if %ERRORLEVEL% NEQ 0 (
    echo [失败] Go代码编译失败
    cd ..\..
    pause
    exit /b 1
)

echo [成功] Go代码编译成功
echo.

cd ..\..

echo ========================================
echo 编译完成！
echo ========================================
echo.
echo 编译结果:
echo   [√] AI Service编译成功
echo   [√] API Service编译成功
echo.
echo 输出文件:
echo   - servicespi-servicein\server.exe
echo   - AI Service使用Python解释器运行
echo.
echo 运行服务:
echo   cd servicespi-servicein
echo   server.exe
echo.
echo   cd servicesi-service
echo   python app\main.py
echo.
pause

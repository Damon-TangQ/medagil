@echo off
REM ========================================
REM Go项目依赖安装脚本
REM 用于自动安装api-service的Go依赖
REM ========================================

echo.
echo ========================================
echo Go项目依赖安装脚本
echo ========================================
echo.

REM 检查Go是否安装
where go >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未找到Go，请先安装Go 1.21或更高版本
    echo 下载地址: https://golang.org/dl/
    pause
    exit /b 1
)

echo [1/5] 检查Go版本...
for /f "tokens=3" %%i in ('go version') do set GO_VERSION=%%i
echo Go版本: %GO_VERSION%
echo.

echo [2/5] 配置Go代理（中国大陆用户）...
go env -w GOPROXY=https://goproxy.cn,direct
if %ERRORLEVEL% NEQ 0 (
    echo [警告] 配置Go代理失败，将使用默认代理
) else (
    echo [成功] Go代理已配置为: https://goproxy.cn,direct
)
echo.

echo [3/5] 进入api-service目录...
cd /d "%~dp0api-service"
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 无法进入api-service目录
    pause
    exit /b 1
)
echo [成功] 当前目录: %CD%
echo.

echo [4/5] 安装Go依赖...
echo [4.1] 运行 go mod tidy...
go mod tidy
if %ERRORLEVEL% NEQ 0 (
    echo [错误] go mod tidy 失败
    pause
    exit /b 1
)
echo [成功] go mod tidy 完成
echo.

echo [4.2] 运行 go mod download...
go mod download
if %ERRORLEVEL% NEQ 0 (
    echo [错误] go mod download 失败
    pause
    exit /b 1
)
echo [成功] go mod download 完成
echo.

echo [4.3] 运行 go mod verify...
go mod verify
if %ERRORLEVEL% NEQ 0 (
    echo [警告] go mod verify 失败，但可能不影响使用
) else (
    echo [成功] go mod verify 完成
)
echo.

echo [5/5] 编译项目...
echo [5.1] 编译api-service...
go build -o bin/server.exe ./cmd/server
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 项目编译失败
    pause
    exit /b 1
)
echo [成功] 项目编译完成，可执行文件: bin\server.exe
echo.

echo ========================================
echo 安装完成！
echo ========================================
echo.
echo 可执行文件位置: %CD%in\server.exe
echo.
echo 如需运行服务，请执行:
echo   bin\server.exe
echo.
echo 或查看配置文件:
echo   config.yaml
echo.
pause

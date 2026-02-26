@echo off
REM ========================================
REM 数据库连接验证脚本
REM 用于验证数据库连接和连接池配置
REM ========================================

setlocal enabledelayedexpansion

echo.
echo ========================================
echo 数据库连接验证脚本
echo ========================================
echo.

REM 检查参数
set ACTION=%1
if "%ACTION%"=="" (
    echo 用法: verify_db_connection.bat [test^|monitor^|stress]
    echo.
    echo 参数说明:
    echo   test    - 测试数据库连接
    echo   monitor - 监控数据库连接数
    echo   stress  - 压力测试，检测连接泄漏
    echo.
    pause
    exit /b 0
)

REM 测试数据库连接
if "%ACTION%"=="test" goto TEST_CONNECTION

REM 监控数据库连接
if "%ACTION%"=="monitor" goto MONITOR_CONNECTIONS

REM 压力测试
if "%ACTION%"=="stress" goto STRESS_TEST

:TEST_CONNECTION
echo.
echo [测试] 数据库连接...
echo.

cd /d "%~dp0api-service"

REM 检查配置文件
if not exist "config.yaml" (
    echo [错误] 未找到配置文件 config.yaml
    pause
    exit /b 1
)

echo [信息] 配置文件存在
echo.

REM 检查可执行文件
if not exist "bin\server.exe" (
    echo [错误] 未找到可执行文件 bin\server.exe
    echo 请先运行 install_go_deps.bat 编译项目
    pause
    exit /b 1
)

echo [信息] 可执行文件存在
echo.

REM 启动服务
echo [信息] 启动服务进行连接测试...
start "api-service-test" cmd /c "bin\server.exe"

REM 等待服务启动
echo [信息] 等待服务启动（10秒）...
timeout /t 10 /nobreak >nul

REM 测试健康检查接口
echo [信息] 测试健康检查接口...
curl -s http://localhost:8080/health
if %ERRORLEVEL% EQU 0 (
    echo.
    echo [成功] 健康检查通过
) else (
    echo.
    echo [失败] 健康检查失败
)

REM 测试API接口
echo.
echo [信息] 测试API接口...
curl -s http://localhost:8080/api/v1/ping
if %ERRORLEVEL% EQU 0 (
    echo.
    echo [成功] API接口测试通过
) else (
    echo.
    echo [失败] API接口测试失败
)

echo.
echo [信息] 停止服务...
taskkill /F /IM server.exe >nul 2>nul

echo.
echo [完成] 数据库连接测试完成
echo.
pause
exit /b 0

:MONITOR_CONNECTIONS
echo.
echo [监控] 数据库连接数...
echo.
echo [提示] 此功能需要netstat命令（Windows）或ss命令（Linux）
echo [提示] 按 Ctrl+C 停止监控
echo.

REM 检查操作系统
ver | findstr /i "windows" >nul
if %ERRORLEVEL% EQU 0 (
    echo [信息] 使用 netstat 命令监控（Windows）
    echo.
    :MONITOR_LOOP
    echo [%time%] 当前PostgreSQL连接数:
    netstat -an | findstr :5432 | find /c /v ""
    timeout /t 5 /nobreak >nul
    goto MONITOR_LOOP
) else (
    echo [信息] 使用 ss 命令监控（Linux/Mac）
    echo.
    :MONITOR_LOOP_UNIX
    echo [%time%] 当前PostgreSQL连接数:
    ss -ant | grep :5432 | wc -l
    sleep 5
    goto MONITOR_LOOP_UNIX
)

:STRESS_TEST
echo.
echo [压力测试] 数据库连接池...
echo.

cd /d "%~dp0api-service"

REM 检查可执行文件
if not exist "bin\server.exe" (
    echo [错误] 未找到可执行文件 bin\server.exe
    pause
    exit /b 1
)

echo [信息] 启动服务...
start "api-service-stress" cmd /c "bin\server.exe"

REM 等待服务启动
echo [信息] 等待服务启动（10秒）...
timeout /t 10 /nobreak >nul

echo.
echo [信息] 开始压力测试...
echo [信息] 将发送100个并发请求到API
echo.

REM 使用PowerShell进行并发请求
powershell -Command "& {$jobs = @(); for($i=1; $i -le 100; $i++) { $jobs += Start-Job -ScriptBlock { Invoke-WebRequest -Uri 'http://localhost:8080/api/v1/ping' -UseBasicParsing } }; Wait-Job -Job $jobs | Out-Null; Remove-Job -Job $jobs }"

echo.
echo [信息] 压力测试完成
echo.

REM 等待连接稳定
echo [信息] 等待连接池稳定（10秒）...
timeout /t 10 /nobreak >nul

REM 检查连接数
echo [信息] 检查当前连接数...
netstat -an | findstr :5432 | find /c /v ""

echo.
echo [信息] 停止服务...
taskkill /F /IM server.exe >nul 2>nul

REM 等待连接关闭
echo [信息] 等待连接关闭（10秒）...
timeout /t 10 /nobreak >nul

REM 再次检查连接数
echo [信息] 检查服务停止后的连接数...
netstat -an | findstr :5432 | find /c /v ""

echo.
echo [完成] 压力测试完成
echo.
echo [说明] 如果服务停止后连接数为0或接近0，说明连接池配置正确
echo       如果连接数仍然很高，可能存在连接泄漏问题
echo.
pause
exit /b 0

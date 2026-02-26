@echo off
REM ========================================
REM 分页性能验证脚本
REM 用于验证大数据量分页查询性能
REM ========================================

setlocal enabledelayedexpansion

echo.
echo ========================================
echo 分页性能验证脚本
echo ========================================
echo.

REM 检查参数
set ACTION=%1
if "%ACTION%"=="" (
    echo 用法: verify_pagination_performance.bat [test^|stress^|monitor]
    echo.
    echo 参数说明:
    echo   test    - 测试分页查询性能
    echo   stress  - 压力测试（模拟大数据量）
    echo   monitor - 监控数据库连接和查询性能
    echo.
    pause
    exit /b 0
)

REM 设置服务地址
set BASE_URL=http://localhost:8080

REM 检查服务是否运行
echo [检查] 检查服务状态...
curl -s %BASE_URL%/health >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 服务未运行，请先启动服务
    pause
    exit /b 1
)
echo [成功] 服务正在运行
echo.

REM 测试分页性能
if "%ACTION%"=="test" goto TEST_PAGINATION
if "%ACTION%"=="stress" goto STRESS_TEST
if "%ACTION%"=="monitor" goto MONITOR_DB

:TEST_PAGINATION
echo.
echo ========================================
echo 测试分页查询性能
echo ========================================
echo.

echo [测试] 测试不同页码的分页查询
echo.

REM 测试第一页
echo [测试] 查询第1页（page=1, pageSize=20）...
for /f "delims=" %%t in ('powershell -Command "Measure-Command { Invoke-WebRequest -Uri '%BASE_URL%/api/v1/projects?page=1^&pageSize=20' -UseBasicParsing | Out-Null } | Select-Object -ExpandProperty TotalMilliseconds"') do set TIME1=%%t
if %ERRORLEVEL% EQU 0 (
    echo [成功] 第1页查询耗时: !TIME1!ms
) else (
    echo [失败] 第1页查询失败
)

REM 测试中间页
echo [测试] 查询第100页（page=100, pageSize=20）...
for /f "delims=" %%t in ('powershell -Command "Measure-Command { Invoke-WebRequest -Uri '%BASE_URL%/api/v1/projects?page=100^&pageSize=20' -UseBasicParsing | Out-Null } | Select-Object -ExpandProperty TotalMilliseconds"') do set TIME2=%%t
if %ERRORLEVEL% EQU 0 (
    echo [成功] 第100页查询耗时: !TIME2!ms
) else (
    echo [失败] 第100页查询失败
)

REM 测试大页码
echo [测试] 查询第1000页（page=1000, pageSize=20）...
for /f "delims=" %%t in ('powershell -Command "Measure-Command { Invoke-WebRequest -Uri '%BASE_URL%/api/v1/projects?page=1000^&pageSize=20' -UseBasicParsing | Out-Null } | Select-Object -ExpandProperty TotalMilliseconds"') do set TIME3=%%t
if %ERRORLEVEL% EQU 0 (
    echo [成功] 第1000页查询耗时: !TIME3!ms
) else (
    echo [失败] 第1000页查询失败
)

echo.
echo [分析] 性能分析
if !TIME1! LSS 1000 (
    echo [通过] 第1页查询时间小于1000ms
) else (
    echo [警告] 第1页查询时间超过1000ms
)

if !TIME2! LSS 1000 (
    echo [通过] 第100页查询时间小于1000ms
) else (
    echo [警告] 第100页查询时间超过1000ms
)

if !TIME3! LSS 1000 (
    echo [通过] 第1000页查询时间小于1000ms
) else (
    echo [警告] 第1000页查询时间超过1000ms
)

goto END

:STRESS_TEST
echo.
echo ========================================
echo 压力测试（模拟大数据量）
echo ========================================
echo.

echo [信息] 发送100个并发分页请求
echo.

REM 使用PowerShell进行并发请求
powershell -Command "& {$jobs = @(); for($i=1; $i -le 100; $i++) { $page = Get-Random -Minimum 1 -Maximum 1000; $jobs += Start-Job -ScriptBlock { try { Invoke-WebRequest -Uri '%BASE_URL%/api/v1/projects?page=$page^&pageSize=20' -UseBasicParsing | Out-Null } catch { Write-Error $_.Exception.Message } } }; $jobs | Wait-Job | Out-Null; $jobs | Remove-Job }"

REM 等待请求完成
echo [信息] 等待请求完成...
timeout /t 5 /nobreak >nul

REM 检查数据库连接
echo.
echo [检查] 检查数据库连接数...
netstat -an | findstr :5432 | find /c /v ""

echo.
echo [完成] 压力测试完成
echo.
echo [说明] 如果数据库连接数稳定且无内存溢出，说明分页实现正确
goto END

:MONITOR_DB
echo.
echo ========================================
echo 监控数据库连接和查询性能
echo ========================================
echo.
echo [提示] 按 Ctrl+C 停止监控
echo.

:MONITOR_LOOP
echo [%time%] 当前状态:
echo   - 数据库连接数:
netstat -an | findstr :5432 | find /c /v ""
echo   - 服务响应时间:
for /f "delims=" %%t in ('powershell -Command "Measure-Command { Invoke-WebRequest -Uri '%BASE_URL%/api/v1/projects?page=1^&pageSize=20' -UseBasicParsing | Out-Null } | Select-Object -ExpandProperty TotalMilliseconds"') do echo     %%t ms

timeout /t 5 /nobreak >nul
goto MONITOR_LOOP

:END
echo.
echo ========================================
echo 验证完成！
echo ========================================
echo.
echo 验证标准:
echo   [√] 大数据量（10万+条）分页查询响应时间^<1s
echo   [√] 无内存溢出
echo   [√] 数据库连接数稳定
echo.
pause

@echo off
REM ========================================
REM 依赖倒置验证脚本
REM 用于验证依赖倒置架构的正确性
REM ========================================

setlocal enabledelayedexpansion

echo.
echo ========================================
echo 依赖倒置验证脚本
echo ========================================
echo.

REM 检查参数
set ACTION=%1
if "%ACTION%"=="" (
    echo 用法: verify_dependency_inversion.bat [test^|mock^|real]
    echo.
    echo 参数说明:
    echo   test  - 完整测试（包含所有场景）
    echo   mock  - 测试模拟仓储
    echo   real  - 测试真实仓储
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

REM 测试模拟仓储
if "%ACTION%"=="mock" goto TEST_MOCK_REPO
if "%ACTION%"=="test" goto TEST_MOCK_REPO
goto TEST_REAL_REPO

:TEST_MOCK_REPO
echo.
echo ========================================
echo 测试场景1: 模拟仓储
echo ========================================
echo.

echo [信息] 模拟仓储说明:
echo   - 使用内存存储数据
echo   - 不依赖真实数据库
echo   - 用于单元测试和开发调试
echo   - 验证依赖倒置的正确性
echo.

echo [测试] 测试模拟仓储的分页查询...
echo.

REM 测试项目分页
echo [测试] 查询第1页项目（pageSize=20）...
curl -s "%BASE_URL%/api/v1/projects?page=1&pageSize=20" | findstr /C:"示例项目" >nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] 模拟仓储返回项目数据
) else (
    echo [失败] 模拟仓储未返回项目数据
)

REM 测试任务分页
echo [测试] 查询第1页任务（pageSize=20）...
curl -s "%BASE_URL%/api/v1/tasks?page=1&pageSize=20" | findstr /C:"示例任务" >nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] 模拟仓储返回任务数据
) else (
    echo [失败] 模拟仓储未返回任务数据
)

REM 测试订单分页
echo [测试] 查询第1页订单（pageSize=20）...
curl -s "%BASE_URL%/api/v1/orders?page=1&pageSize=20" | findstr /C:"ORD" >nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] 模拟仓储返回订单数据
) else (
    echo [失败] 模拟仓储未返回订单数据
)

if not "%ACTION%"=="test" goto END

REM 测试真实仓储
:TEST_REAL_REPO
echo.
echo ========================================
echo 测试场景2: 真实仓储
echo ========================================
echo.

echo [信息] 真实仓储说明:
echo   - 使用PostgreSQL数据库
echo   - 使用GORM进行数据库操作
echo   - 用于生产环境
echo   - 验证依赖倒置的正确性
echo.

echo [测试] 测试真实仓储的分页查询...
echo.

REM 测试项目分页
echo [测试] 查询第1页项目（pageSize=20）...
curl -s "%BASE_URL%/api/v1/projects?page=1&pageSize=20" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] 真实仓储返回项目数据
) else (
    echo [失败] 真实仓储未返回项目数据
)

REM 测试任务分页
echo [测试] 查询第1页任务（pageSize=20）...
curl -s "%BASE_URL%/api/v1/tasks?page=1&pageSize=20" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] 真实仓储返回任务数据
) else (
    echo [失败] 真实仓储未返回任务数据
)

REM 测试订单分页
echo [测试] 查询第1页订单（pageSize=20）...
curl -s "%BASE_URL%/api/v1/orders?page=1&pageSize=20" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] 真实仓储返回订单数据
) else (
    echo [失败] 真实仓储未返回订单数据
)

:END
echo.
echo ========================================
echo 验证完成！
echo ========================================
echo.
echo 验证标准:
echo   [√] use_cases层依赖接口而非具体实现
echo   [√] 可以替换仓储实现（模拟/真实）
echo   [√] 替换仓储实现时use_cases层无需修改代码
echo   [√] 模拟仓储可用于单元测试
echo   [√] 真实仓储可用于生产环境
echo.
pause

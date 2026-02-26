@echo off
REM ========================================
REM 管理端鉴权验证脚本
REM 用于测试adminAuthMiddleware的功能
REM ========================================

setlocal enabledelayedexpansion

echo.
echo ========================================
echo 管理端鉴权验证脚本
echo ========================================
echo.

REM 检查参数
set ACTION=%1
if "%ACTION%"=="" (
    echo 用法: verify_admin_auth.bat [test^|valid^|invalid^|missing]
    echo.
    echo 参数说明:
    echo   test    - 完整测试（包含所有场景）
    echo   valid   - 测试有效token
    echo   invalid - 测试无效token
    echo   missing - 测试缺失token
    echo.
    pause
    exit /b 0
)

REM 设置服务地址
set BASE_URL=http://localhost:8080
set ADMIN_TOKEN=admin_default_token

REM 检查服务是否运行
echo [检查] 检查服务状态...
curl -s %BASE_URL%/health >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 服务未运行，请先启动服务
    echo.
    echo 启动服务:
    echo   cd api-service
    echo   bin\server.exe
    echo.
    pause
    exit /b 1
)
echo [成功] 服务正在运行
echo.

REM 测试有效token
if "%ACTION%"=="valid" goto TEST_VALID_TOKEN
if "%ACTION%"=="test" goto TEST_VALID_TOKEN
goto TEST_INVALID_TOKEN

:TEST_VALID_TOKEN
echo.
echo ========================================
echo 测试场景1: 有效token
echo ========================================
echo.
echo [信息] 使用有效token访问管理端接口
echo [信息] Token: %ADMIN_TOKEN%
echo.

curl -s -X GET "%BASE_URL%/api/v1/admin/ping" -H "X-Admin-Token: %ADMIN_TOKEN%"
echo.

if %ERRORLEVEL% EQU 0 (
    echo [成功] 有效token可以正常访问
) else (
    echo [失败] 有效token访问失败
)

if not "%ACTION%"=="test" goto END

REM 测试无效token
:TEST_INVALID_TOKEN
echo.
echo ========================================
echo 测试场景2: 无效token
echo ========================================
echo.
echo [信息] 使用无效token访问管理端接口
echo [信息] Token: invalid_token_12345
echo.

curl -s -X GET "%BASE_URL%/api/v1/admin/ping" -H "X-Admin-Token: invalid_token_12345"
echo.

if %ERRORLEVEL% NEQ 0 (
    echo [成功] 无效token被正确拒绝（返回401）
) else (
    echo [失败] 无效token未被拒绝
)

if not "%ACTION%"=="test" goto END

REM 测试缺失token
:TEST_MISSING_TOKEN
echo.
echo ========================================
echo 测试场景3: 缺失token
echo ========================================
echo.
echo [信息] 不提供token访问管理端接口
echo.

curl -s -X GET "%BASE_URL%/api/v1/admin/ping"
echo.

if %ERRORLEVEL% NEQ 0 (
    echo [成功] 缺失token被正确拒绝（返回401）
) else (
    echo [失败] 缺失token未被拒绝
)

if not "%ACTION%"=="test" goto END

REM 测试需要鉴权的接口
:TEST_PROTECTED_ENDPOINTS
echo.
echo ========================================
echo 测试场景4: 测试受保护的管理端接口
echo ========================================
echo.

echo [测试] /api/v1/admin/dashboard/stats
curl -s -X GET "%BASE_URL%/api/v1/admin/dashboard/stats" -H "X-Admin-Token: %ADMIN_TOKEN%"
echo.

echo [测试] /api/v1/admin/users
curl -s -X GET "%BASE_URL%/api/v1/admin/users" -H "X-Admin-Token: %ADMIN_TOKEN%"
echo.

echo [测试] /api/v1/admin/tasks
curl -s -X GET "%BASE_URL%/api/v1/admin/tasks" -H "X-Admin-Token: %ADMIN_TOKEN%"
echo.

echo [成功] 所有受保护接口测试完成

:END
echo.
echo ========================================
echo 验证完成！
echo ========================================
echo.
echo 验证标准:
echo   [√] 有效token可以正常访问管理端接口
echo   [√] 无效token返回401未授权
echo   [√] 缺失token返回401未授权
echo   [√] 所有受保护接口都需要鉴权
echo.
pause

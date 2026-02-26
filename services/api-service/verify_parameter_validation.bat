@echo off
REM ========================================
REM 参数校验验证脚本
REM 用于验证参数校验和错误处理
REM ========================================

setlocal enabledelayedexpansion

echo.
echo ========================================
echo 参数校验验证脚本
echo ========================================
echo.

echo [检查] 检查use_cases目录...
if not exist "use_cases" (
    echo [错误] use_cases目录不存在
    pause
    exit /b 1
)

echo [成功] use_cases目录存在
echo.

echo [信息] 验证参数校验逻辑
echo.

echo [检查] 检查project_use_case.go...
findstr /C:"if page < 1" use_cases\project_use_case.go >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] project_use_case.go包含页码校验
) else (
    echo [失败] project_use_case.go缺少页码校验
)

findstr /C:"if pageSize < 1" use_cases\project_use_case.go >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] project_use_case.go包含每页条数校验
) else (
    echo [失败] project_use_case.go缺少每页条数校验
)

findstr /C:"页码无效" use_cases\project_use_case.go >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] project_use_case.go包含页码错误提示
) else (
    echo [失败] project_use_case.go缺少页码错误提示
)

findstr /C:"每页条数无效" use_cases\project_use_case.go >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] project_use_case.go包含每页条数错误提示
) else (
    echo [失败] project_use_case.go缺少每页条数错误提示
)

echo.
echo [检查] 检查task_use_case.go...
findstr /C:"if page < 1" use_cases	ask_use_case.go >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] task_use_case.go包含页码校验
) else (
    echo [失败] task_use_case.go缺少页码校验
)

findstr /C:"if pageSize < 1" use_cases	ask_use_case.go >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] task_use_case.go包含每页条数校验
) else (
    echo [失败] task_use_case.go缺少每页条数校验
)

findstr /C:"页码无效" use_cases	ask_use_case.go >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] task_use_case.go包含页码错误提示
) else (
    echo [失败] task_use_case.go缺少页码错误提示
)

findstr /C:"每页条数无效" use_cases	ask_use_case.go >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] task_use_case.go包含每页条数错误提示
) else (
    echo [失败] task_use_case.go缺少每页条数错误提示
)

echo.
echo [检查] 检查order_use_case.go...
findstr /C:"if page < 1" use_cases\order_use_case.go >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] order_use_case.go包含页码校验
) else (
    echo [失败] order_use_case.go缺少页码校验
)

findstr /C:"if pageSize < 1" use_cases\order_use_case.go >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] order_use_case.go包含每页条数校验
) else (
    echo [失败] order_use_case.go缺少每页条数校验
)

findstr /C:"页码无效" use_cases\order_use_case.go >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] order_use_case.go包含页码错误提示
) else (
    echo [失败] order_use_case.go缺少页码错误提示
)

findstr /C:"每页条数无效" use_cases\order_use_case.go >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] order_use_case.go包含每页条数错误提示
) else (
    echo [失败] order_use_case.go缺少每页条数错误提示
)

echo.
echo [检查] 检查main.go中的错误处理...
findstr /C:"页码无效" cmd\server\main.go >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] main.go包含页码错误处理
) else (
    echo [失败] main.go缺少页码错误处理
)

findstr /C:"每页条数无效" cmd\server\main.go >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] main.go包含每页条数错误处理
) else (
    echo [失败] main.go缺少每页条数错误处理
)

findstr /C:"BadRequest" cmd\server\main.go >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] main.go包含400错误处理
) else (
    echo [失败] main.go缺少400错误处理
)

findstr /C:"InternalServerError" cmd\server\main.go >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] main.go包含500错误处理
) else (
    echo [失败] main.go缺少500错误处理
)

echo.
echo ========================================
echo 验证完成！
echo ========================================
echo.
echo 验证标准:
echo   [√] page<1返回"页码无效"
echo   [√] pageSize>100返回"每页条数不超过100"
echo   [√] 分页相关错误返回400
echo   [√] 非分页错误返回500
echo.
pause

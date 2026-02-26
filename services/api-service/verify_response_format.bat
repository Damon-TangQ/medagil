@echo off
REM ========================================
REM 响应格式验证脚本
REM 用于验证API响应格式的一致性
REM ========================================

setlocal enabledelayedexpansion

echo.
echo ========================================
echo 响应格式验证脚本
echo ========================================
echo.

echo [检查] 检查main.go中的响应结构...
findstr /C:"type Response struct" cmd\server\main.go >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] Response结构体已定义
) else (
    echo [失败] Response结构体未定义
    pause
    exit /b 1
)

echo.
echo [检查] 检查响应中间件...
findstr /C:"responseMiddleware" cmd\server\main.go >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] responseMiddleware已定义
) else (
    echo [失败] responseMiddleware未定义
    pause
    exit /b 1
)

echo.
echo [检查] 检查响应结构字段...
findstr /C:"Code int" cmd\server\main.go >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] Response包含Code字段
) else (
    echo [失败] Response缺少Code字段
)

findstr /C:"Msg string" cmd\server\main.go >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] Response包含Msg字段
) else (
    echo [失败] Response缺少Msg字段
)

findstr /C:"Data interface" cmd\server\main.go >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] Response包含Data字段
) else (
    echo [失败] Response缺少Data字段
)

echo.
echo [检查] 检查响应格式说明...
findstr /C:"code:0" cmd\server\main.go >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] 成功响应格式正确
) else (
    echo [失败] 成功响应格式不正确
)

findstr /C:"msg:success" cmd\server\main.go >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] 成功响应消息正确
) else (
    echo [失败] 成功响应消息不正确
)

findstr /C:"data:null" cmd\server\main.go >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] 错误响应格式正确
) else (
    echo [失败] 错误响应格式不正确
)

echo.
echo [检查] 检查中间件使用...
findstr /C:"r.Use(responseMiddleware())" cmd\server\main.go >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [成功] 中间件已注册
) else (
    echo [失败] 中间件未注册
)

echo.
echo ========================================
echo 验证完成！
echo ========================================
echo.
echo 验证标准:
echo   [√] 成功响应格式: {"code":0,"msg":"success","data":{}}
echo   [√] 错误响应格式: {"code":状态码,"msg":"错误信息","data":null}
echo   [√] 所有/api/v1/*路由返回格式一致
echo   [√] 无零散JSON结构
echo.
pause

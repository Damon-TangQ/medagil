
@echo off
chcp 65001 >nul
echo ========================================
echo Medagil平台 - 服务停止工具
echo ========================================
echo.

echo 正在查找运行中的服务...

:: 查找并停止后端服务
for /f "tokens=2 delims=," %%a in ('tasklist /v /fo csv /nh ^| findstr /i "node.exe"') do (
    for /f "tokens=1,2 delims=," %%x in ('tasklist /v /fo csv /nh ^| findstr /i "%%a"') do (
        echo %%x | findstr /i "backend" >nul
        if not errorlevel 1 (
            echo [1/2] 正在停止后端服务 (PID: %%y)...
            taskkill /f /pid %%y >nul 2>&1
            if not errorlevel 1 (
                echo     后端服务已停止
            )
        )
    )
)

:: 查找并停止前端服务
for /f "tokens=2 delims=," %%a in ('tasklist /v /fo csv /nh ^| findstr /i "node.exe"') do (
    for /f "tokens=1,2 delims=," %%x in ('tasklist /v /fo csv /nh ^| findstr /i "%%a"') do (
        echo %%x | findstr /i "frontend" >nul
        if not errorlevel 1 (
            echo [2/2] 正在停止前端服务 (PID: %%y)...
            taskkill /f /pid %%y >nul 2>&1
            if not errorlevel 1 (
                echo     前端服务已停止
            )
        )
    )
)

echo.
echo ========================================
echo 停止操作完成
echo ========================================
echo.
echo 提示：
echo - 某些服务可能需要几秒钟才能完全停止
echo - 如果服务仍在运行，可以手动关闭对应窗口
echo.
pause

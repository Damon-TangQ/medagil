@echo off
chcp 65001 >nul
echo ========================================
echo Medagil平台 - 服务启动工具
echo ========================================
echo.

:: 检查Node.js是否安装
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Node.js，请先安装Node.js
    pause
    exit /b 1
)

:: 检查npm是否安装
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到npm，请先安装npm
    pause
    exit /b 1
)

:: 显示菜单
echo 请选择要启动的服务：
echo.
echo [1] 启动所有服务（后端 + 前端）
echo [2] 仅启动后端服务
echo [3] 仅启动前端服务
echo [4] 启动所有服务 + 打开浏览器
echo [5] 退出
echo.
set /p choice=请输入选项 (1-5): 

if "%choice%"=="1" goto all_services
if "%choice%"=="2" goto backend_only
if "%choice%"=="3" goto frontend_only
if "%choice%"=="4" goto all_with_browser
if "%choice%"=="5" goto end
goto invalid_choice

:all_services
echo.
echo [1/2] 启动后端服务...
start "Backend Service" cmd /k "cd backend && npm run dev"
timeout /t 5 /nobreak > nul
echo [2/2] 启动前端服务...
start "Frontend Service" cmd /k "cd frontend && npm run dev"
goto show_urls

:backend_only
echo.
echo [1/1] 启动后端服务...
start "Backend Service" cmd /k "cd backend && npm run dev"
goto show_backend_url

:frontend_only
echo.
echo [1/1] 启动前端服务...
start "Frontend Service" cmd /k "cd frontend && npm run dev"
goto show_frontend_url

:all_with_browser
echo.
echo [1/3] 启动后端服务...
start "Backend Service" cmd /k "cd backend && npm run dev"
timeout /t 5 /nobreak > nul
echo [2/3] 启动前端服务...
start "Frontend Service" cmd /k "cd frontend && npm run dev"
timeout /t 3 /nobreak > nul
echo [3/3] 打开浏览器...
start http://localhost:5173
goto show_urls

:show_urls
echo.
echo ========================================
echo 服务启动成功！
echo ========================================
echo 后端服务: http://localhost:5000
echo 前端服务: http://localhost:5173
echo API文档: http://localhost:5000/api/docs
echo ========================================
echo.
echo 提示：
echo - 服务将在独立窗口中运行
echo - 关闭此窗口不会停止服务
echo - 如需停止服务，请关闭相应的服务窗口
echo.
pause >nul
goto end

:show_backend_url
echo.
echo ========================================
echo 后端服务启动成功！
echo ========================================
echo 后端服务: http://localhost:5000
echo API文档: http://localhost:5000/api/docs
echo ========================================
echo.
pause >nul
goto end

:show_frontend_url
echo.
echo ========================================
echo 前端服务启动成功！
echo ========================================
echo 前端服务: http://localhost:5173
echo ========================================
echo.
pause >nul
goto end

:invalid_choice
echo.
echo [错误] 无效的选项，请重新运行脚本
pause
goto end

:end

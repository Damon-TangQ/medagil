@echo off
echo ====================================
echo Medagil AI Platform - 编译和运行脚本
echo ====================================
echo.

echo [1/3] 处理后端服务...
cd /d %~dp0backend
if not exist node_modules (
    echo 安装后端依赖...
    call npm install
)
echo 编译后端...
call npm run build
echo 启动后端服务...
start "Medagil Backend" cmd /k "npm run dev"
echo 后端服务已启动
echo.

echo [2/3] 处理前端应用...
cd /d %~dp0frontend
if not exist node_modules (
    echo 安装前端依赖...
    call npm install
)
echo 编译前端...
call npm run build
echo 启动前端服务...
start "Medagil Frontend" cmd /k "npm run dev"
echo 前端服务已启动
echo.

echo [3/3] 处理管理后台...
cd /d %~dp0admin
if not exist node_modules (
    echo 安装管理后台依赖...
    call npm install
)
echo 编译管理后台...
call npm run build
echo 启动管理后台服务...
start "Medagil Admin" cmd /k "npm run dev"
echo 管理后台服务已启动
echo.

echo ====================================
echo 所有服务已启动！
echo 后端服务: http://localhost:3000 (默认端口)
echo 前端服务: http://localhost:5173 (默认端口)
echo 管理后台: http://localhost:5174 (默认端口)
echo ====================================
echo.
pause

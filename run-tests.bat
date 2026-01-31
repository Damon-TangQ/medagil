
@echo off
chcp 65001 >nul
echo ========================================
echo Medagil平台 - 测试运行工具
echo ========================================
echo.

:: 检查是否在后端目录
if not exist "backend\package.json" (
    echo [错误] 请在项目根目录运行此脚本
    pause
    exit /b 1
)

:: 显示菜单
echo 请选择测试模式：
echo.
echo [1] 运行所有测试
echo [2] 运行测试并监听文件变化
echo [3] 运行测试并生成覆盖率报告
echo [4] 仅运行特定测试文件
echo [5] 退出
echo.
set /p choice=请输入选项 (1-5): 

if "%choice%"=="1" goto run_all
if "%choice%"=="2" goto run_watch
if "%choice%"=="3" goto run_coverage
if "%choice%"=="4" goto run_specific
if "%choice%"=="5" goto end
goto invalid_choice

:run_all
echo.
echo [1/1] 运行所有测试...
cd backend
call npm test
goto show_result

:run_watch
echo.
echo [2/2] 运行测试并监听文件变化...
cd backend
call npm run test:watch
goto end

:run_coverage
echo.
echo [3/3] 运行测试并生成覆盖率报告...
cd backend
call npm run test:coverage
echo.
echo 覆盖率报告已生成，请查看 backend/coverage 目录
goto end

:run_specific
echo.
echo [4/4] 请输入要运行的测试文件路径
echo 示例：tests/MockUserService.test.ts
set /p testFile=测试文件路径: 
if "%testFile%"=="" (
    echo [错误] 测试文件路径不能为空
    pause
    goto end
)
cd backend
call npm test %testFile%
goto end

:show_result
echo.
if %errorlevel% equ 0 (
    echo ========================================
    echo 测试通过！
    echo ========================================
) else (
    echo ========================================
    echo 测试失败！
    echo 错误代码: %errorlevel%
    echo ========================================
)
pause
goto end

:invalid_choice
echo.
echo [错误] 无效的选项，请重新运行脚本
pause
goto end

:end

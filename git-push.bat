
@echo off
chcp 65001 >nul
echo ========================================
echo Medagil平台 - Git上传工具
echo ========================================
echo.

:: 检查是否在Git仓库中
if not exist ".git" (
    echo [错误] 当前目录不是Git仓库
    echo 请先执行: git init
    pause
    exit /b 1
)

:: 显示当前状态
echo [1/5] 检查Git状态...
git status
echo.

:: 添加所有更改
echo [2/5] 添加所有更改...
git add .
echo.

:: 提交更改
echo [3/5] 提交更改...
set /p commitMsg=请输入提交信息（默认：更新代码）:
if "%commitMsg%"=="" set commitMsg=更新代码
git commit -m "%commitMsg%"
echo.

:: 显示远程仓库
echo [4/5] 检查远程仓库...
git remote -v
echo.

:: 推送到远程仓库
echo [5/5] 推送到远程仓库...
git push
echo.

echo ========================================
echo 完成！
echo ========================================
pause

# ========================================
# 依赖验证PowerShell脚本
# 用于验证Go和Python依赖是否正确安装
# ========================================

function Write-Result {
    param(
        [string]$Message,
        [string]$Status = "INFO"
    )

    $color = switch ($Status) {
        "PASS"    { "Green" }
        "FAIL"    { "Red" }
        "WARN"    { "Yellow" }
        default   { "Cyan" }
    }

    Write-Host "[$Status] $Message" -ForegroundColor $color
}

function Test-GoDependencies {
    Write-Result "验证Go依赖..."
    Write-Host ""

    $allPassed = $true

    # 检查Go是否安装
    $goCmd = Get-Command go -ErrorAction SilentlyContinue
    if (-not $goCmd) {
        Write-Result "未找到Go" -Status "FAIL"
        $allPassed = $false
    } else {
        Write-Result "Go已安装" -Status "PASS"
        $goVersion = go version
        Write-Result "版本: $goVersion" -Status "INFO"
    }

    # 进入api-service目录
    $apiServicePath = Join-Path $PSScriptRoot "api-service"
    if (Test-Path $apiServicePath) {
        Set-Location $apiServicePath
    } else {
        Write-Result "无法找到api-service目录" -Status "FAIL"
        $allPassed = $false
        return $allPassed
    }

    # 检查go.mod
    if (Test-Path "go.mod") {
        Write-Result "go.mod存在" -Status "PASS"
    } else {
        Write-Result "go.mod不存在" -Status "FAIL"
        $allPassed = $false
    }

    # 检查go.sum
    if (Test-Path "go.sum") {
        Write-Result "go.sum存在" -Status "PASS"
    } else {
        Write-Result "go.sum不存在" -Status "FAIL"
        $allPassed = $false
    }

    # 检查bin目录
    $serverExe = Join-Path $apiServicePath "bin\server.exe"
    if (Test-Path $serverExe) {
        Write-Result "api-service可执行文件存在" -Status "PASS"
    } else {
        Write-Result "api-service可执行文件不存在（可能需要编译）" -Status "WARN"
    }

    # 验证关键Go包
    Write-Host ""
    Write-Result "验证Go依赖包..." -Status "INFO"

    $goPackages = @(
        "github.com/gin-gonic/gin",
        "github.com/spf13/viper",
        "gorm.io/gorm",
        "gorm.io/driver/postgres"
    )

    foreach ($package in $goPackages) {
        $result = go list -m $package 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Result $package -Status "PASS"
        } else {
            Write-Result $package -Status "FAIL"
            $allPassed = $false
        }
    }

    return $allPassed
}

function Test-PythonDependencies {
    Write-Result "验证Python依赖..."
    Write-Host ""

    $allPassed = $true

    # 检查Python是否安装
    $pythonCmd = Get-Command python -ErrorAction SilentlyContinue
    if (-not $pythonCmd) {
        Write-Result "未找到Python" -Status "FAIL"
        $allPassed = $false
    } else {
        Write-Result "Python已安装" -Status "PASS"
        $pythonVersion = python --version 2>&1
        Write-Result "版本: $pythonVersion" -Status "INFO"
    }

    # 进入ai-service目录
    $aiServicePath = Join-Path $PSScriptRoot "ai-service"
    if (Test-Path $aiServicePath) {
        Set-Location $aiServicePath
    } else {
        Write-Result "无法找到ai-service目录" -Status "FAIL"
        $allPassed = $false
        return $allPassed
    }

    # 检查虚拟环境
    $venvPath = Join-Path $aiServicePath "venv"
    if (Test-Path $venvPath) {
        Write-Result "Python虚拟环境存在" -Status "PASS"
    } else {
        Write-Result "Python虚拟环境不存在" -Status "WARN"
    }

    # 激活虚拟环境
    $activateScript = Join-Path $venvPath "Scripts\Activate.ps1"
    if (Test-Path $activateScript) {
        & $activateScript
    }

    # 验证关键Python包
    Write-Host ""
    Write-Result "验证Python依赖包..." -Status "INFO"

    $pythonPackages = @{
        "fastapi" = "fastapi"
        "psycopg2" = "psycopg2-binary"
        "pydantic" = "pydantic"
        "uvicorn" = "uvicorn"
        "requests" = "requests"
    }

    foreach ($package in $pythonPackages.GetEnumerator()) {
        $result = python -c "import $($package.Key); print(f'$($package.Value): {$($package.Key).__version__}')" 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Result $result -Status "PASS"
        } else {
            $status = if ($package.Key -eq "psycopg2") { "WARN" } else { "FAIL" }
            Write-Result "$($package.Value)" -Status $status
            if ($status -eq "FAIL") {
                $allPassed = $false
            }
        }
    }

    return $allPassed
}

# 主程序
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "依赖验证脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$goPassed = Test-GoDependencies
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$pythonPassed = Test-PythonDependencies
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 显示验证结果
if ($goPassed -and $pythonPassed) {
    Write-Host "[成功] 所有核心依赖验证通过！" -ForegroundColor Green
    Write-Host ""
    Write-Host "您可以运行以下命令启动服务:" -ForegroundColor Cyan
    Write-Host "  .\start_services.bat all" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "[警告] 部分依赖验证失败" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "请运行以下命令安装缺失的依赖:" -ForegroundColor Cyan
    Write-Host "  .\install_go_deps.bat" -ForegroundColor White
    Write-Host "  .\install_python_deps.bat" -ForegroundColor White
    Write-Host ""
    Write-Host "或使用PowerShell脚本:" -ForegroundColor Cyan
    Write-Host "  .\Install-Dependencies.ps1 -Target all" -ForegroundColor White
    Write-Host ""
}

exit ($goPassed -and $pythonPassed)

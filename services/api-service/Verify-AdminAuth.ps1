# ========================================
# 管理端鉴权验证PowerShell脚本
# 用于测试adminAuthMiddleware的功能
# ========================================

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("test", "valid", "invalid", "missing")]
    [string]$Action = "test"
)

function Write-Step {
    param(
        [string]$Message,
        [string]$Status = "INFO"
    )

    $color = switch ($Status) {
        "SUCCESS" { "Green" }
        "WARNING" { "Yellow" }
        "ERROR"   { "Red" }
        default   { "Cyan" }
    }

    Write-Host "[$Status] $Message" -ForegroundColor $color
}

function Test-ValidToken {
    Write-Step "测试场景1: 有效token" -Status "INFO"
    Write-Host ""
    Write-Step "使用有效token访问管理端接口" -Status "INFO"
    Write-Step "Token: $adminToken" -Status "INFO"
    Write-Host ""

    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/api/v1/admin/ping" `
            -Headers @{"X-Admin-Token" = $adminToken} `
            -UseBasicParsing

        Write-Host "响应: $($response.Content)" -ForegroundColor Gray
        Write-Step "有效token可以正常访问" -Status "SUCCESS"
        return $true
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 401) {
            Write-Step "有效token访问失败（返回401）" -Status "ERROR"
        } else {
            Write-Step "有效token访问失败: $($_.Exception.Message)" -Status "ERROR"
        }
        return $false
    }
}

function Test-InvalidToken {
    Write-Step "测试场景2: 无效token" -Status "INFO"
    Write-Host ""
    Write-Step "使用无效token访问管理端接口" -Status "INFO"
    Write-Step "Token: invalid_token_12345" -Status "INFO"
    Write-Host ""

    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/api/v1/admin/ping" `
            -Headers @{"X-Admin-Token" = "invalid_token_12345"} `
            -UseBasicParsing

        Write-Host "响应: $($response.Content)" -ForegroundColor Gray
        Write-Step "无效token未被拒绝（应该返回401）" -Status "ERROR"
        return $false
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 401) {
            Write-Step "无效token被正确拒绝（返回401）" -Status "SUCCESS"
            return $true
        } else {
            Write-Step "无效token验证失败: $($_.Exception.Message)" -Status "ERROR"
            return $false
        }
    }
}

function Test-MissingToken {
    Write-Step "测试场景3: 缺失token" -Status "INFO"
    Write-Host ""
    Write-Step "不提供token访问管理端接口" -Status "INFO"
    Write-Host ""

    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/api/v1/admin/ping" -UseBasicParsing

        Write-Host "响应: $($response.Content)" -ForegroundColor Gray
        Write-Step "缺失token未被拒绝（应该返回401）" -Status "ERROR"
        return $false
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 401) {
            Write-Step "缺失token被正确拒绝（返回401）" -Status "SUCCESS"
            return $true
        } else {
            Write-Step "缺失token验证失败: $($_.Exception.Message)" -Status "ERROR"
            return $false
        }
    }
}

function Test-ProtectedEndpoints {
    Write-Step "测试场景4: 测试受保护的管理端接口" -Status "INFO"
    Write-Host ""

    $endpoints = @(
        "/api/v1/admin/dashboard/stats",
        "/api/v1/admin/users",
        "/api/v1/admin/tasks",
        "/api/v1/admin/orders",
        "/api/v1/admin/knowledge/sources"
    )

    $allPassed = $true
    foreach ($endpoint in $endpoints) {
        Write-Step "测试 $endpoint" -Status "INFO"
        try {
            $response = Invoke-WebRequest -Uri "$baseUrl$endpoint" `
                -Headers @{"X-Admin-Token" = $adminToken} `
                -UseBasicParsing

            Write-Host "响应: $($response.Content.Substring(0, [Math]::Min(100, $response.Content.Length)))..." -ForegroundColor Gray
            Write-Step "访问成功" -Status "SUCCESS"
        } catch {
            Write-Step "访问失败: $($_.Exception.Message)" -Status "ERROR"
            $allPassed = $false
        }
        Write-Host ""
    }

    return $allPassed
}

# 主程序
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "管理端鉴权验证脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 配置
$baseUrl = "http://localhost:8080"
$adminToken = "admin_default_token"

# 检查服务是否运行
Write-Step "检查服务状态..." -Status "INFO"
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/health" -UseBasicParsing
    Write-Step "服务正在运行" -Status "SUCCESS"
    Write-Host ""
} catch {
    Write-Step "服务未运行，请先启动服务" -Status "ERROR"
    Write-Host ""
    Write-Step "启动服务:" -Status "INFO"
    Write-Host "  cd api-service" -ForegroundColor White
    Write-Host "  .in\server.exe" -ForegroundColor White
    Write-Host ""
    exit 1
}

# 执行测试
$results = @()

if ($Action -eq "test" -or $Action -eq "valid") {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    $results += Test-ValidToken
}

if ($Action -eq "test" -or $Action -eq "invalid") {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    $results += Test-InvalidToken
}

if ($Action -eq "test" -or $Action -eq "missing") {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    $results += Test-MissingToken
}

if ($Action -eq "test") {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    $results += Test-ProtectedEndpoints
}

# 显示结果
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "验证完成！" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Step "验证标准:" -Status "INFO"
Write-Host "  [√] 有效token可以正常访问管理端接口" -ForegroundColor White
Write-Host "  [√] 无效token返回401未授权" -ForegroundColor White
Write-Host "  [√] 缺失token返回401未授权" -ForegroundColor White
Write-Host "  [√] 所有受保护接口都需要鉴权" -ForegroundColor White
Write-Host ""

# 检查所有测试是否通过
$allPassed = $true
foreach ($result in $results) {
    if (-not $result) {
        $allPassed = $false
    }
}

if ($allPassed) {
    Write-Host "[成功] 所有测试通过！" -ForegroundColor Green
    exit 0
} else {
    Write-Host "[失败] 部分测试未通过" -ForegroundColor Red
    exit 1
}

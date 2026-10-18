<?php
/**
 * THE CREATORS AI ACADEMY - Schedule Portal Real-Time Cloud Sync API (V6 Hardened)
 * Host: https://thecreator-mcn.com/schedule/api.php
 * - Enforces X-Creators-Admin-Token on full state overwrite
 * - Supports safe atomic `public_append` for visitor reviews/consults/instructor applications
 * - Automatically creates data/schedule_db.backup.json before any write
 */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Creators-Admin-Token");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$ADMIN_SECRET_TOKEN = "tc_portal_admin_v6_8077_secure";

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
}
$dbFile = $dataDir . '/schedule_db.json';
$backupFile = $dataDir . '/schedule_db.backup.json';
$defaultFile = __DIR__ . '/default_seed.json';

if (!file_exists($dbFile) && file_exists($defaultFile)) {
    @copy($defaultFile, $dbFile);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (file_exists($dbFile)) {
        $raw = @file_get_contents($dbFile);
        if ($raw) {
            echo $raw;
            exit;
        }
    }
    if (file_exists($defaultFile)) {
        echo @file_get_contents($defaultFile);
        exit;
    }
    echo json_encode([
        "version" => "v6",
        "updatedAt" => round(microtime(true) * 1000),
        "lectures" => []
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($method === 'POST') {
    $input = file_get_contents('php://input');
    $decoded = json_decode($input, true);
    if (!$decoded || !is_array($decoded)) {
        http_response_code(400);
        echo json_encode(["ok" => false, "error" => "Invalid JSON payload"], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Load current state
    $current = [];
    if (file_exists($dbFile)) {
        $raw = @file_get_contents($dbFile);
        if ($raw) {
            $parsed = json_decode($raw, true);
            if (is_array($parsed)) {
                $current = $parsed;
            }
        }
    }

    $action = isset($decoded['action']) ? $decoded['action'] : 'admin_save';

    // Mode 1: Safe Public Append (Never touches `lectures`, `stats`, `instructors`, `companyInfo`, `heroConfig`, `tickerItems`)
    if ($action === 'public_append') {
        $targetField = isset($decoded['targetField']) ? $decoded['targetField'] : '';
        $item = isset($decoded['item']) ? $decoded['item'] : null;
        $allowedAppendFields = ['reviews', 'consultApplications', 'instructorApplications'];

        if (!in_array($targetField, $allowedAppendFields, true) || !is_array($item)) {
            http_response_code(400);
            echo json_encode(["ok" => false, "error" => "Invalid public_append parameters"], JSON_UNESCAPED_UNICODE);
            exit;
        }

        if (!isset($current[$targetField]) || !is_array($current[$targetField])) {
            $current[$targetField] = [];
        }

        // Prevent duplicate ID insertion
        $newId = isset($item['id']) ? (string)$item['id'] : '';
        $exists = false;
        foreach ($current[$targetField] as $existingItem) {
            if (isset($existingItem['id']) && (string)$existingItem['id'] === $newId) {
                $exists = true;
                break;
            }
        }
        if (!$exists) {
            array_unshift($current[$targetField], $item);
        }

        $current['updatedAt'] = isset($decoded['updatedAt']) ? $decoded['updatedAt'] : round(microtime(true) * 1000);
        $current['savedAtServer'] = date('c');

        if (file_exists($dbFile)) {
            @copy($dbFile, $backupFile);
        }

        $jsonOut = json_encode($current, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        @file_put_contents($dbFile, $jsonOut, LOCK_EX);

        echo json_encode([
            "ok" => true,
            "mode" => "public_append",
            "targetField" => $targetField,
            "updatedAt" => $current['updatedAt'],
            "count" => count($current[$targetField])
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Mode 2: Full Admin State Save (Requires valid Admin Token)
    $headerToken = isset($_SERVER['HTTP_X_CREATORS_ADMIN_TOKEN']) ? $_SERVER['HTTP_X_CREATORS_ADMIN_TOKEN'] : '';
    $bodyToken = isset($decoded['adminToken']) ? $decoded['adminToken'] : '';
    if ($headerToken !== $ADMIN_SECRET_TOKEN && $bodyToken !== $ADMIN_SECRET_TOKEN) {
        http_response_code(403);
        echo json_encode([
            "ok" => false,
            "error" => "Unauthorized: Valid X-Creators-Admin-Token is required for state modification."
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Automatic pre-write backup
    if (file_exists($dbFile)) {
        @copy($dbFile, $backupFile);
    }

    $allowedKeys = [
        'version', 'updatedAt', 'exportedAt',
        'lectures', 'stats', 'tickerItems', 'heroConfig',
        'instructors', 'companyInfo', 'reviews',
        'instructorApplications', 'consultApplications'
    ];
    foreach ($allowedKeys as $k) {
        if (array_key_exists($k, $decoded)) {
            $current[$k] = $decoded[$k];
        }
    }
    $current['updatedAt'] = isset($decoded['updatedAt']) ? $decoded['updatedAt'] : round(microtime(true) * 1000);
    $current['savedAtServer'] = date('c');

    $jsonOut = json_encode($current, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    $written = @file_put_contents($dbFile, $jsonOut, LOCK_EX);

    if ($written === false) {
        http_response_code(500);
        echo json_encode(["ok" => false, "error" => "Failed to write schedule_db.json"], JSON_UNESCAPED_UNICODE);
        exit;
    }

    echo json_encode([
        "ok" => true,
        "mode" => "admin_save",
        "updatedAt" => $current['updatedAt'],
        "lecturesCount" => isset($current['lectures']) && is_array($current['lectures']) ? count($current['lectures']) : 0
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(405);
echo json_encode(["ok" => false, "error" => "Method not allowed"], JSON_UNESCAPED_UNICODE);

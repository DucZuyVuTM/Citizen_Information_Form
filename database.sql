-- Tạo user nếu chưa tồn tại
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_roles WHERE rolname = 'app_user'
    ) THEN
        CREATE USER app_user WITH PASSWORD 'password';
    END IF;
END
$$;

-- Đặt lại mật khẩu để đảm bảo
ALTER USER app_user WITH PASSWORD 'password';

-- Tạo database nếu chưa tồn tại
SELECT 'CREATE DATABASE bigdata'
WHERE NOT EXISTS (
    SELECT FROM pg_database WHERE datname = 'bigdata'
)\gexec

-- Kết nối tới database
\c bigdata

-- Tạo bảng nếu chưa tồn tại
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'citizens'
    ) THEN
        CREATE TABLE citizens (
            name VARCHAR(255) NOT NULL,
            date_of_birth DATE NOT NULL,
            citizen_code VARCHAR(255) PRIMARY KEY
        );
    END IF;
END
$$;

-- Gán quyền truy cập
GRANT ALL PRIVILEGES ON DATABASE bigdata TO app_user;
GRANT ALL PRIVILEGES ON TABLE citizens TO app_user;
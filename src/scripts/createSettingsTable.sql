-- Create settings table to store configuration
CREATE TABLE IF NOT EXISTS settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(255) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert bKash configuration settings
INSERT INTO settings (setting_key, setting_value, description) VALUES
('bkash_app_key', '1KboS6ZLL5DH1oCt5dVc8hm5tc', 'bKash Application Key'),
('bkash_app_secret', '0yaPy0DeKpvrilI6s5HL1a3Qmf5Zt9ftNg6KZHS7Z92Z02fCd3nn', 'bKash Application Secret'),
('bkash_username', '01600056805', 'bKash API Username'),
('bkash_password', '8tZ!?>v&%:h', 'bKash API Password'),
('bkash_base_url', 'https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout', 'bKash API Base URL'),
('base_url', 'http://localhost:3000', 'Application Base URL')
ON DUPLICATE KEY UPDATE 
    setting_value = VALUES(setting_value),
    updated_at = CURRENT_TIMESTAMP;

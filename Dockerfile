# Sử dụng image Python 3.9 slim để giảm kích thước
FROM python:3.9-slim

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép requirements.txt và cài đặt dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Sao chép toàn bộ mã nguồn
COPY . .

# Thiết lập biến môi trường (PORT mặc định cho Render)
ENV PORT=8079

# Chạy ứng dụng
CMD ["python", "app.py"]
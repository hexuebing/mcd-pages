# Megvii Gis vue examples 镜像
FROM nginx:latest

# 拷贝配置文件
COPY conf.d /etc/nginx/conf.d

# 拷贝网站页面
COPY spaceName /usr/share/nginx/www

# 重新加载nginx
# CMD nginx -s reload

# EXPOSE 9001
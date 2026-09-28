import math
import random
import os
import subprocess

WIDTH = 1376
HEIGHT = 768

def clamp(val, low=0, high=255):
    return max(low, min(high, int(val)))

def lerp_color(c1, c2, t):
    t = max(0.0, min(1.0, t))
    return (
        int(c1[0] + (c2[0] - c1[0]) * t),
        int(c1[1] + (c2[1] - c1[1]) * t),
        int(c1[2] + (c2[2] - c1[2]) * t)
    )

def multi_gradient(y, stops):
    # stops: list of (pos_y, (r, g, b))
    if y <= stops[0][0]:
        return stops[0][1]
    if y >= stops[-1][0]:
        return stops[-1][1]
    for i in range(len(stops) - 1):
        y0, c0 = stops[i]
        y1, c1 = stops[i+1]
        if y0 <= y <= y1:
            t = (y - y0) / (y1 - y0) if y1 != y0 else 0
            return lerp_color(c0, c1, t)
    return stops[-1][1]

class ImageCanvas:
    def __init__(self, w=WIDTH, h=HEIGHT, bg=(10, 15, 25)):
        self.w = w
        self.h = h
        self.pixels = bytearray([bg[0], bg[1], bg[2]] * (w * h))

    def set_pixel(self, x, y, r, g, b, alpha=1.0):
        if 0 <= x < self.w and 0 <= y < self.h:
            idx = (y * self.w + x) * 3
            if alpha >= 1.0:
                self.pixels[idx] = clamp(r)
                self.pixels[idx+1] = clamp(g)
                self.pixels[idx+2] = clamp(b)
            elif alpha > 0.0:
                cur_r = self.pixels[idx]
                cur_g = self.pixels[idx+1]
                cur_b = self.pixels[idx+2]
                self.pixels[idx] = clamp(cur_r * (1 - alpha) + r * alpha)
                self.pixels[idx+1] = clamp(cur_g * (1 - alpha) + g * alpha)
                self.pixels[idx+2] = clamp(cur_b * (1 - alpha) + b * alpha)

    def draw_rect(self, x0, y0, w, h, color, alpha=1.0):
        for y in range(max(0, y0), min(self.h, y0 + h)):
            for x in range(max(0, x0), min(self.w, x0 + w)):
                self.set_pixel(x, y, color[0], color[1], color[2], alpha)

    def draw_vertical_gradient(self, y0, y1, stops):
        for y in range(max(0, y0), min(self.h, y1)):
            c = multi_gradient(y, stops)
            for x in range(self.w):
                self.set_pixel(x, y, c[0], c[1], c[2])

    def draw_circle(self, cx, cy, radius, color, alpha=1.0):
        r_sq = radius * radius
        for dy in range(-int(radius), int(radius) + 1):
            py = cy + dy
            if 0 <= py < self.h:
                for dx in range(-int(radius), int(radius) + 1):
                    px = cx + dx
                    if 0 <= px < self.w:
                        dist_sq = dx*dx + dy*dy
                        if dist_sq <= r_sq:
                            edge = 1.0 - (dist_sq / r_sq)
                            self.set_pixel(px, py, color[0], color[1], color[2], alpha * min(1.0, edge * 2))

    def draw_line(self, x0, y0, x1, y1, color, thickness=1, alpha=1.0):
        dx = abs(x1 - x0)
        dy = abs(y1 - y0)
        sx = 1 if x0 < x1 else -1
        sy = 1 if y0 < y1 else -1
        err = dx - dy
        cx, cy = x0, y0
        while True:
            for tx in range(-thickness // 2, thickness // 2 + 1):
                for ty in range(-thickness // 2, thickness // 2 + 1):
                    self.set_pixel(cx + tx, cy + ty, color[0], color[1], color[2], alpha)
            if cx == x1 and cy == y1:
                break
            e2 = 2 * err
            if e2 > -dy:
                err -= dy
                cx += sx
            if e2 < dx:
                err += dx
                cy += sy

    def save_jpg(self, path):
        ppm_path = path.replace('.jpg', '.ppm')
        with open(ppm_path, 'wb') as f:
            f.write(f'P6\n{self.w} {self.h}\n255\n'.encode('ascii'))
            f.write(self.pixels)
        subprocess.run(['convert', ppm_path, '-quality', '92', path], check=True)
        if os.path.exists(ppm_path):
            os.remove(ppm_path)
        print(f"Generated: {path} ({os.path.getsize(path)} bytes)")

print("Renderer initialized.")

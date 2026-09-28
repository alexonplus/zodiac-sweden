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

class Canvas:
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
                            self.set_pixel(px, py, color[0], color[1], color[2], alpha * min(1.0, edge * 2.5))

    def draw_glow_circle(self, cx, cy, radius, color, alpha=0.5):
        for dy in range(-int(radius), int(radius) + 1):
            py = cy + dy
            if 0 <= py < self.h:
                for dx in range(-int(radius), int(radius) + 1):
                    px = cx + dx
                    if 0 <= px < self.w:
                        dist = math.hypot(dx, dy)
                        if dist <= radius:
                            fade = (1.0 - dist / radius) ** 1.8
                            self.set_pixel(px, py, color[0], color[1], color[2], alpha * fade)

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

    def draw_polygon(self, points, color, alpha=1.0):
        # Scanline polygon fill
        min_y = max(0, min(p[1] for p in points))
        max_y = min(self.h - 1, max(p[1] for p in points))
        n = len(points)
        for y in range(min_y, max_y + 1):
            nodes = []
            j = n - 1
            for i in range(n):
                p1 = points[i]
                p2 = points[j]
                if (p1[1] < y and p2[1] >= y) or (p2[1] < y and p1[1] >= y):
                    x = int(p1[0] + (y - p1[1]) / (p2[1] - p1[1]) * (p2[0] - p1[0]))
                    nodes.append(x)
                j = i
            nodes.sort()
            for k in range(0, len(nodes) - 1, 2):
                x_start = max(0, nodes[k])
                x_end = min(self.w - 1, nodes[k+1])
                for x in range(x_start, x_end + 1):
                    self.set_pixel(x, y, color[0], color[1], color[2], alpha)

    def save_jpg(self, path):
        ppm_path = path.replace('.jpg', '.ppm')
        with open(ppm_path, 'wb') as f:
            f.write(f'P6\n{self.w} {self.h}\n255\n'.encode('ascii'))
            f.write(self.pixels)
        subprocess.run(['convert', ppm_path, '-quality', '92', path], check=True)
        if os.path.exists(ppm_path):
            os.remove(ppm_path)
        print(f"Generated: {path} ({os.path.getsize(path)} bytes)")


# =========================================================================
# SUBLEVEL 1: GÖTEBORG 1-1: ERIKSBERG SHIPYARDS & SUNSET MARINA
# =========================================================================
def render_goteborg_1():
    c = Canvas()
    print("Rendering goteborg-1...")
    
    # 1. Warm Sunset Sky Gradient
    sky_stops = [
        (0, (12, 28, 55)),      # Twilight deep marine blue
        (160, (28, 52, 90)),    # Soft cobalt
        (300, (135, 55, 30)),   # Sunset burnt orange
        (400, (220, 95, 25)),   # Glowing fiery amber
        (470, (255, 175, 45)),  # Bright golden horizon
        (510, (255, 215, 95))   # Pure sunset glow
    ]
    c.draw_vertical_gradient(0, 510, sky_stops)

    # 2. Glowing Sun Disk low over horizon
    c.draw_glow_circle(440, 410, 140, (255, 200, 80), alpha=0.45)
    c.draw_glow_circle(440, 410, 60, (255, 235, 150), alpha=0.75)
    c.draw_circle(440, 410, 32, (255, 255, 220), alpha=1.0)

    # 3. Layered Dusk Clouds
    clouds = [
        (180, 160, 420, 32, (65, 42, 60), 0.7),
        (580, 220, 520, 38, (80, 48, 65), 0.65),
        (80, 280, 360, 28, (120, 55, 45), 0.6),
        (850, 320, 480, 34, (160, 75, 40), 0.6),
        (320, 360, 600, 30, (210, 105, 40), 0.75)
    ]
    for cx, cy, cw, ch, col, a in clouds:
        for ox in range(-cw//2, cw//2, 12):
            h_var = int(ch * (1 - (ox / (cw//2))**2)**0.5)
            c.draw_circle(cx + ox, cy, h_var, col, alpha=a)
        # Golden bottom rim
        c.draw_line(cx - cw//3, cy + ch//2, cx + cw//3, cy + ch//2, (255, 195, 70), thickness=2, alpha=a * 0.8)

    # 4. Distant Gothenburg Skyline (y: 350 to 510)
    city_col = (25, 30, 45)
    
    # "Läppstiftet" (The Lipstick Tower / Lilla Bommen) at x=1050
    c.draw_rect(1040, 310, 55, 190, city_col)
    c.draw_polygon([(1040, 310), (1065, 265), (1095, 310)], (190, 45, 35)) # Red sloped roof
    c.draw_rect(1060, 250, 6, 20, (230, 230, 240)) # Spire
    for wy in range(325, 490, 14):
        c.draw_rect(1046, wy, 42, 6, (255, 220, 130), alpha=0.6)

    # Viking Barken 4-Masted Tall Ship at x=910
    c.draw_polygon([(870, 475), (960, 475), (945, 500), (885, 500)], (18, 22, 32)) # Hull
    for mx in [890, 910, 930, 948]:
        c.draw_line(mx, 360, mx, 475, (20, 25, 35), thickness=2) # Masts
        c.draw_line(mx - 14, 395, mx + 14, 395, (20, 25, 35), thickness=1)
        c.draw_line(mx - 12, 425, mx + 12, 425, (20, 25, 35), thickness=1)

    # Waterfront Warehouses & City Blocks
    buildings = [
        (50, 410, 90, 95), (160, 390, 80, 115), (260, 430, 110, 75),
        (650, 420, 120, 85), (790, 400, 70, 105), (1120, 420, 130, 85),
        (1270, 395, 90, 110)
    ]
    for bx, by, bw, bh in buildings:
        c.draw_rect(bx, by, bw, bh, city_col)
        # Gabled Roof
        c.draw_polygon([(bx, by), (bx + bw//2, by - 16), (bx + bw, by)], (35, 40, 55))
        # Warm sunset window glints
        for wx in range(bx + 8, bx + bw - 10, 16):
            for wy in range(by + 12, by + bh - 10, 18):
                c.draw_rect(wx, wy, 8, 10, (255, 180, 60), alpha=0.55)

    # 5. GIANT ERIKSBERG SHIPYARD GANTRY CRANE (Bockkranen) - Main Foreground Landmark
    crane_col = (215, 75, 18)     # Iconic Eriksberg Orange-Red
    crane_hi = (245, 125, 45)
    crane_shad = (130, 35, 10)
    
    # Left A-Frame Leg (x: 240 -> 350)
    c.draw_line(240, 510, 340, 120, crane_col, thickness=12)
    c.draw_line(280, 510, 355, 120, crane_col, thickness=10)
    c.draw_line(240, 510, 340, 120, crane_hi, thickness=3)
    # Right A-Frame Leg (x: 620 -> 510)
    c.draw_line(620, 510, 520, 120, crane_col, thickness=12)
    c.draw_line(580, 510, 505, 120, crane_col, thickness=10)
    c.draw_line(620, 510, 520, 120, crane_shad, thickness=3)

    # Cross-bracing trusses on legs
    for y_cross in range(160, 500, 55):
        c.draw_line(250 + (y_cross * 90 // 500), y_cross, 280 + (y_cross * 70 // 500), y_cross, crane_col, thickness=4)
        c.draw_line(530 + (y_cross * 75 // 500), y_cross, 500 + (y_cross * 85 // 500), y_cross, crane_col, thickness=4)

    # Colossal Horizontal Crane Box-Girder Boom
    c.draw_rect(200, 95, 480, 36, crane_col)
    c.draw_rect(200, 95, 480, 6, crane_hi)
    c.draw_rect(200, 125, 480, 6, crane_shad)
    # Counterweight & Machinery Cabin on Left
    c.draw_rect(170, 85, 70, 50, (30, 35, 45))
    c.draw_rect(175, 90, 60, 12, (215, 75, 18))

    # Hoist Trolley & Cables hanging in center
    c.draw_rect(410, 131, 55, 24, (45, 50, 60))
    c.draw_line(425, 155, 425, 340, (180, 180, 190), thickness=2)
    c.draw_line(445, 155, 445, 340, (180, 180, 190), thickness=2)
    # Heavy Lifting Hook
    c.draw_rect(420, 340, 30, 20, (35, 40, 50))
    c.draw_circle(435, 370, 10, (180, 180, 190), alpha=1.0)

    # Red Aircraft Warning Beacons (Top of Crane)
    for bx in [210, 435, 670]:
        c.draw_glow_circle(bx, 88, 16, (255, 40, 40), alpha=0.8)
        c.draw_circle(bx, 88, 5, (255, 200, 200), alpha=1.0)

    # 6. Water Surface: Göta älv River (y: 505 to 768)
    water_stops = [
        (505, (180, 95, 35)),   # Sunset specular golden band at shoreline
        (540, (95, 55, 30)),    # Deep bronze reflection
        (600, (35, 45, 65)),    # Maritime teal-navy
        (680, (18, 30, 48)),    # Deep twilight water
        (768, (10, 20, 35))     # Deep bottom harbor water
    ]
    c.draw_vertical_gradient(505, 768, water_stops)

    # Sun & Crane Specular Reflection on Water
    for ry in range(510, 760, 6):
        spread = int(70 + (ry - 510) * 0.9)
        ref_col = lerp_color((255, 210, 80), (14, 25, 45), (ry - 510) / 250)
        c.draw_line(440 - spread // 2, ry, 440 + spread // 2, ry, ref_col, thickness=2, alpha=0.45)
        # Wave sparkles
        for _ in range(8):
            wx = random.randint(50, WIDTH - 50)
            c.draw_line(wx, ry, wx + random.randint(8, 28), ry, (255, 220, 140), thickness=1, alpha=0.35)

    # Pier Pylons & Navigation Buoy
    c.draw_rect(80, 495, 14, 80, (40, 30, 25))
    c.draw_rect(180, 495, 14, 80, (40, 30, 25))
    c.draw_polygon([(760, 560), (775, 530), (790, 560)], (220, 40, 30)) # Red Buoy
    c.draw_circle(775, 528, 4, (255, 255, 255), alpha=1.0)

    c.save_jpg('assets/goteborg-1.jpg')


# =========================================================================
# SUBLEVEL 2: GÖTEBORG 1-2: BLUE TRAMWAY & LINDHOLMEN CYBER TECH
# =========================================================================
def render_goteborg_2():
    c = Canvas()
    print("Rendering goteborg-2...")

    # 1. Rainy Cyberpunk Twilight Indigo Sky
    sky_stops = [
        (0, (5, 10, 22)),       # Pitch midnight indigo
        (180, (12, 22, 44)),    # Deep cyber navy
        (350, (24, 38, 70)),    # Wet twilight blue
        (470, (42, 58, 95)),    # City light pollution horizon
        (510, (55, 75, 115))
    ]
    c.draw_vertical_gradient(0, 510, sky_stops)

    # Distant Neon City Glow (Cyan and Magenta)
    c.draw_glow_circle(380, 460, 250, (0, 200, 255), alpha=0.25)
    c.draw_glow_circle(960, 450, 220, (180, 60, 240), alpha=0.22)

    # 2. Lindholmen Cyber Science Park Glass Towers (y: 120 to 500)
    towers = [
        # x, y, w, h, base_col, win_col
        (60, 220, 110, 280, (16, 25, 42), (0, 240, 255)),
        (190, 140, 140, 360, (22, 32, 54), (160, 230, 255)),
        (350, 190, 120, 310, (18, 28, 48), (140, 90, 240)),
        (490, 110, 160, 390, (25, 36, 60), (0, 240, 255)),
        (850, 160, 130, 340, (20, 30, 50), (0, 240, 255)),
        (1000, 120, 150, 380, (26, 38, 62), (200, 120, 255)),
        (1170, 210, 120, 290, (18, 26, 45), (120, 220, 255))
    ]
    for tx, ty, tw, th, base_col, win_col in towers:
        c.draw_rect(tx, ty, tw, th, base_col)
        # Modern glass vertical mullions
        for mx in range(tx, tx + tw, 18):
            c.draw_line(mx, ty, mx, ty + th, (40, 55, 85), thickness=1)
        # Glowing office floor grids
        for fy in range(ty + 15, ty + th - 20, 16):
            c.draw_line(tx + 4, fy, tx + tw - 4, fy, (35, 48, 75), thickness=2)
            for fx in range(tx + 6, tx + tw - 12, 18):
                if (fx + fy * 3) % 5 != 0: # Random lighted offices
                    c.draw_rect(fx, fy - 10, 12, 8, win_col, alpha=0.65)

    # Iconic "Kuggen" (Lindholmen's Red Cylindrical Geometric Wonder) at x=680
    kuggen_col = (185, 35, 30)
    c.draw_rect(670, 260, 150, 240, kuggen_col)
    for row, ky in enumerate(range(270, 490, 30)):
        offset = 12 if row % 2 == 1 else 0
        for kx in range(680 + offset, 810, 28):
            # Faceted triangular/polygonal windows
            c.draw_polygon([(kx, ky + 18), (kx + 12, ky), (kx + 24, ky + 18)], (255, 200, 60), alpha=0.85)

    # Neon Billboards & Holograms
    c.draw_rect(490, 95, 160, 16, (0, 240, 255), alpha=0.9)
    c.draw_glow_circle(570, 103, 40, (0, 240, 255), alpha=0.45) # LINDHOLMEN sign glow
    c.draw_rect(1000, 105, 150, 16, (215, 60, 255), alpha=0.9)
    c.draw_glow_circle(1075, 113, 40, (215, 60, 255), alpha=0.4)

    # Overhead Catenary Electric Wires & Cross-Pylons
    for px in [150, 450, 750, 1050, 1300]:
        c.draw_line(px, 200, px, 500, (45, 55, 75), thickness=4)
        c.draw_line(px - 30, 200, px + 30, 200, (60, 75, 100), thickness=3)
    # Hanging sag wires
    for wy in [210, 235, 260]:
        for segment in range(0, WIDTH, 80):
            c.draw_line(segment, wy + int(math.sin(segment * 0.05) * 4), segment + 80, wy + int(math.sin((segment + 80) * 0.05) * 4), (100, 130, 170), thickness=1, alpha=0.7)

    # 3. GOTHENBURG CLASSIC BLUE TRAMWAY (Västtrafik M31 Tram)
    tram_x, tram_y = 520, 380
    tram_w, tram_h = 320, 110
    tram_blue = (56, 189, 248)    # Classic Gothenburg Light Blue
    tram_cream = (245, 240, 220)  # Classic Cream/White Roof

    # Lower Blue Body
    c.draw_rect(tram_x, tram_y + 40, tram_w, 60, tram_blue)
    # Upper Cream Body & Roof
    c.draw_rect(tram_x, tram_y + 10, tram_w, 32, tram_cream)
    c.draw_polygon([(tram_x, tram_y + 10), (tram_x + 25, tram_y), (tram_x + tram_w - 25, tram_y), (tram_x + tram_w, tram_y + 10)], tram_cream)
    
    # Tram Windows with Warm Interior Glow
    for wx in range(tram_x + 20, tram_x + tram_w - 30, 44):
        c.draw_rect(wx, tram_y + 18, 34, 30, (255, 235, 140), alpha=0.9)
        c.draw_rect(wx + 2, tram_y + 20, 30, 6, (255, 255, 220), alpha=0.9)

    # Dual High-Beam Headlights
    c.draw_circle(tram_x + tram_w - 8, tram_y + 65, 8, (255, 255, 255), alpha=1.0)
    c.draw_glow_circle(tram_x + tram_w + 30, tram_y + 65, 80, (255, 255, 200), alpha=0.5)

    # Pantograph with Electric Blue Arc Spark
    c.draw_line(tram_x + 160, tram_y, tram_x + 180, tram_y - 45, (180, 190, 210), thickness=3)
    c.draw_line(tram_x + 180, tram_y - 45, tram_x + 150, tram_y - 85, (180, 190, 210), thickness=3)
    c.draw_line(tram_x + 130, tram_y - 85, tram_x + 175, tram_y - 85, (220, 230, 250), thickness=4)
    # Electric Spark Arc
    c.draw_glow_circle(tram_x + 155, tram_y - 85, 25, (0, 240, 255), alpha=0.8)
    c.draw_circle(tram_x + 155, tram_y - 85, 6, (255, 255, 255), alpha=1.0)

    # 4. Wet Reflective Cobblestone Street & Canal Ground (y: 490 to 768)
    street_stops = [
        (490, (22, 28, 40)),
        (540, (16, 22, 34)),
        (620, (12, 16, 26)),
        (768, (8, 12, 20))
    ]
    c.draw_vertical_gradient(490, 768, street_stops)

    # Wet Asphalt Neon Reflections (Cyan & Tram Light Trails)
    for ry in range(495, 768, 8):
        c.draw_line(tram_x, ry, tram_x + tram_w, ry, (0, 200, 255), thickness=2, alpha=0.25)
        c.draw_line(tram_x + tram_w - 40, ry, tram_x + tram_w + 120, ry, (255, 240, 150), thickness=2, alpha=0.3)
        # Wet ground specular lines
        for _ in range(6):
            sx = random.randint(0, WIDTH - 100)
            c.draw_line(sx, ry, sx + random.randint(20, 60), ry, (60, 120, 180), thickness=1, alpha=0.35)

    # Tramway Tracks on Ground
    c.draw_line(0, 520, WIDTH, 520, (140, 160, 185), thickness=3)
    c.draw_line(0, 532, WIDTH, 532, (140, 160, 185), thickness=3)

    c.save_jpg('assets/goteborg-2.jpg')


# =========================================================================
# SUBLEVEL 3: GÖTEBORG 1-3: SKANSEN KRONAN FORTRESS & VOLVO FACTORY RUINS
# =========================================================================
def render_goteborg_3():
    c = Canvas()
    print("Rendering goteborg-3...")

    # 1. Moody Stormy Nordic Purple-Grey Twilight Sky
    sky_stops = [
        (0, (10, 8, 20)),       # Deep dark violet
        (160, (28, 18, 48)),    # Storm purple
        (320, (52, 30, 75)),    # Electric mauve
        (450, (65, 45, 85)),    # Smudged industrial haze
        (510, (50, 40, 65))
    ]
    c.draw_vertical_gradient(0, 510, sky_stops)

    # Forked Lightning Bolt in the Storm Clouds (x: 480 to 540)
    c.draw_glow_circle(510, 140, 120, (190, 140, 255), alpha=0.3)
    lightning_pts = [(510, 40), (505, 90), (525, 140), (515, 180), (535, 230), (520, 270), (540, 310)]
    for i in range(len(lightning_pts) - 1):
        c.draw_line(lightning_pts[i][0], lightning_pts[i][1], lightning_pts[i+1][0], lightning_pts[i+1][1], (255, 255, 255), thickness=3)
        c.draw_line(lightning_pts[i][0], lightning_pts[i][1], lightning_pts[i+1][0], lightning_pts[i+1][1], (210, 180, 255), thickness=6, alpha=0.6)

    # 2. Left Side: Risåsberget Hill with SKANSEN KRONAN FORTRESS
    # Granite rocky hill slope
    hill_pts = [(0, 510), (0, 340), (140, 290), (320, 250), (480, 270), (620, 380), (740, 510)]
    c.draw_polygon(hill_pts, (25, 32, 28)) # Dark rocky moss granite
    # Granite rock ridges
    for hx in range(60, 580, 45):
        c.draw_line(hx, 280 + int(math.sin(hx*0.04)*40), hx + 35, 350 + int(math.sin(hx*0.04)*40), (15, 20, 18), thickness=3)

    # SKANSEN KRONAN STONE FORTRESS TOWER (Iconic 17th Century Redoubt)
    fx, fy = 240, 150
    fw, fh = 160, 120
    stone_col = (110, 105, 100) # Heavy Bohuslän Granite
    stone_dark = (65, 60, 58)
    
    # Octagonal Fortress Base & Rampart Walls
    c.draw_rect(fx, fy + 35, fw, fh - 35, stone_col)
    c.draw_polygon([(fx - 15, fy + 35), (fx, fy + 35), (fx, fy + fh), (fx - 15, fy + fh)], stone_dark)
    c.draw_polygon([(fx + fw, fy + 35), (fx + fw + 15, fy + 35), (fx + fw + 15, fy + fh), (fx + fw, fy + fh)], stone_dark)
    
    # Stone battlements & embrasures (gun slots)
    for bx in range(fx + 10, fx + fw - 10, 28):
        c.draw_rect(bx, fy + 24, 16, 14, stone_dark)
        # Miniature black cannon barrels
        c.draw_rect(bx + 4, fy + 28, 18, 5, (20, 20, 25))

    # Pyramidal Wooden Roof
    c.draw_polygon([(fx - 20, fy + 35), (fx + fw // 2, fy - 10), (fx + fw + 20, fy + 35)], (55, 38, 30))
    c.draw_polygon([(fx + fw // 2, fy - 10), (fx + fw // 2 + 10, fy - 10), (fx + fw + 20, fy + 35), (fx + fw // 2, fy + 35)], (38, 25, 20))

    # THE FAMOUS GOLDEN CROWN (KRONAN) on Roof Spire
    c.draw_line(fx + fw // 2, fy - 10, fx + fw // 2, fy - 35, (215, 185, 45), thickness=4)
    # Gilded 3-Point Royal Swedish Crown
    c.draw_polygon([
        (fx + fw // 2 - 16, fy - 35),
        (fx + fw // 2 - 20, fy - 52),
        (fx + fw // 2 - 8, fy - 42),
        (fx + fw // 2, fy - 56),      # Center peak
        (fx + fw // 2 + 8, fy - 42),
        (fx + fw // 2 + 20, fy - 52),
        (fx + fw // 2 + 16, fy - 35)
    ], (255, 215, 60))
    c.draw_glow_circle(fx + fw // 2, fy - 45, 28, (255, 215, 60), alpha=0.55)

    # 3. Right Side: INDUSTRIAL VOLVO FACTORY RUINS & SMOKESTACKS
    ruins_col = (75, 35, 25) # Aged Red Brick
    ruins_dark = (45, 22, 16)

    # Tall Industrial Smokestacks at x=1020, 1180
    for sx, sh in [(1020, 310), (1180, 270)]:
        c.draw_polygon([(sx, 510), (sx + 8, 510 - sh), (sx + 36, 510 - sh), (sx + 44, 510)], ruins_col)
        c.draw_rect(sx + 6, 510 - sh - 8, 32, 10, (30, 25, 25))
        # Billowing Smoke Plumes rising into stormy sky
        for sm in range(6):
            c.draw_glow_circle(sx + 20 + sm * 15, 510 - sh - 25 - sm * 22, 28 + sm * 8, (35, 30, 40), alpha=0.6)

    # Volvo Brick Assembly Halls & Iron Truss Girders
    c.draw_rect(820, 340, 220, 170, ruins_col)
    c.draw_polygon([(820, 340), (930, 290), (1040, 340)], ruins_dark)
    # Industrial Gantry & Iron Truss Girder Bridge
    c.draw_line(740, 380, 1260, 380, (50, 55, 65), thickness=6)
    for gx in range(760, 1240, 40):
        c.draw_line(gx, 380, gx + 20, 420, (50, 55, 65), thickness=3)
        c.draw_line(gx + 20, 420, gx + 40, 380, (50, 55, 65), thickness=3)

    # Glowing Furnace Forge Windows
    for wy in [380, 430]:
        for wx in range(840, 1000, 38):
            c.draw_rect(wx, wy, 24, 30, (255, 120, 30), alpha=0.8)
            c.draw_glow_circle(wx + 12, wy + 15, 25, (255, 100, 20), alpha=0.35)

    # Giant Rusted Iron Gear / Cogwheel embedded in factory wall at x=1120
    gear_cx, gear_cy = 1120, 420
    c.draw_circle(gear_cx, gear_cy, 45, (85, 50, 30))
    c.draw_circle(gear_cx, gear_cy, 28, (45, 25, 15))
    c.draw_circle(gear_cx, gear_cy, 12, (85, 50, 30))
    # Gear teeth
    for th in range(8):
        ang = th * (math.pi / 4)
        c.draw_rect(gear_cx + int(math.cos(ang) * 44) - 5, gear_cy + int(math.sin(ang) * 44) - 5, 10, 10, (95, 55, 35))

    # 4. Ground: Cobblestones, Bastion Steps & Factory Yard (y: 500 to 768)
    ground_stops = [
        (500, (40, 32, 28)),
        (560, (26, 22, 22)),
        (650, (18, 16, 18)),
        (768, (12, 10, 14))
    ]
    c.draw_vertical_gradient(500, 768, ground_stops)

    # Industrial Rails & Scattered Cog Debris
    c.draw_line(780, 530, WIDTH, 530, (80, 75, 80), thickness=3)
    c.draw_line(780, 545, WIDTH, 545, (80, 75, 80), thickness=3)

    c.save_jpg('assets/goteborg-3.jpg')


# =========================================================================
# SUBLEVEL 4: GÖTEBORG 1-4: ÄLVSBORGSBRON TO ABYSSAL KRAKEN
# =========================================================================
def render_goteborg_4():
    c = Canvas()
    print("Rendering goteborg-4...")

    # 1. Midnight Tempest & Deep Abyss Sky
    sky_stops = [
        (0, (2, 6, 16)),        # Deep abyssal void
        (160, (6, 18, 38)),     # Storm ocean navy
        (300, (12, 30, 60)),    # Tempest cobalt
        (440, (16, 42, 80)),    # Sea mist glow
        (510, (10, 32, 65))
    ]
    c.draw_vertical_gradient(0, 510, sky_stops)

    # Violent Lightning Fork tearing through the night sky (x=880)
    c.draw_glow_circle(880, 180, 180, (120, 200, 255), alpha=0.35)
    lightning_bolts = [(880, 30), (870, 90), (895, 150), (865, 210), (900, 280), (885, 360), (910, 440)]
    for i in range(len(lightning_bolts) - 1):
        c.draw_line(lightning_bolts[i][0], lightning_bolts[i][1], lightning_bolts[i+1][0], lightning_bolts[i+1][1], (255, 255, 255), thickness=4)
        c.draw_line(lightning_bolts[i][0], lightning_bolts[i][1], lightning_bolts[i+1][0], lightning_bolts[i+1][1], (100, 220, 255), thickness=8, alpha=0.6)

    # 2. MONUMENTAL ÄLVSBORGSBRON SUSPENSION BRIDGE
    # Bridge Tower Color: Iconic Sea-Green Steel (#1e4e46)
    bridge_col = (30, 78, 70)
    bridge_hi = (50, 120, 110)
    bridge_dark = (16, 45, 40)

    # Pylon Towers at x=340 and x=980
    for tx in [340, 980]:
        # Twin vertical concrete/steel pylon shafts
        c.draw_rect(tx, 70, 24, 440, bridge_col)
        c.draw_rect(tx + 46, 70, 24, 440, bridge_col)
        c.draw_rect(tx, 70, 6, 440, bridge_hi)
        c.draw_rect(tx + 64, 70, 6, 440, bridge_dark)
        
        # Crossbeam portal struts
        for cy in [110, 190, 270, 350]:
            c.draw_rect(tx, cy, 70, 20, bridge_col)
            c.draw_line(tx, cy, tx + 70, cy + 20, (50, 120, 110), thickness=2)
            c.draw_line(tx + 70, cy, tx, cy + 20, (16, 45, 40), thickness=2)

        # Flashing Red Aviation Beacon on tower summits
        c.draw_glow_circle(tx + 12, 65, 22, (255, 30, 30), alpha=0.85)
        c.draw_circle(tx + 12, 65, 6, (255, 220, 220), alpha=1.0)
        c.draw_glow_circle(tx + 58, 65, 22, (255, 30, 30), alpha=0.85)
        c.draw_circle(tx + 58, 65, 6, (255, 220, 220), alpha=1.0)

    # Sweeping Parabolic Main Suspension Cables
    # Curve from left edge -> Tower 1 (340) -> Middle dip (660, 280) -> Tower 2 (980) -> right edge
    cable_col = (200, 220, 230)
    cable_hi = (255, 255, 255)
    
    # Left back-stay cable
    c.draw_line(0, 360, 340, 75, cable_col, thickness=5)
    # Right back-stay cable
    c.draw_line(1050, 75, WIDTH, 360, cable_col, thickness=5)

    # Main suspension span (parabola)
    prev_x, prev_y = 410, 75
    for sx in range(410, 980, 10):
        norm = (sx - 695) / 285 # -1 to 1
        sy = int(75 + (1 - norm**2) * 195)
        c.draw_line(prev_x, prev_y, sx, sy, cable_col, thickness=5)
        c.draw_line(prev_x, prev_y, sx, sy, cable_hi, thickness=2)
        # Vertical suspender wire ropes down to road deck
        if sx % 22 == 0:
            c.draw_line(sx, sy, sx, 350, (140, 170, 185), thickness=1, alpha=0.7)
        prev_x, prev_y = sx, sy

    # Suspension Roadway Truss Deck (y=345 to 370)
    c.draw_rect(0, 345, WIDTH, 24, (35, 45, 55))
    c.draw_line(0, 345, WIDTH, 345, (80, 110, 130), thickness=3)
    # Headlight streaks along bridge roadway
    c.draw_line(0, 356, WIDTH, 356, (255, 240, 160), thickness=2, alpha=0.6) # Amber headlights
    c.draw_line(0, 362, WIDTH, 362, (255, 50, 50), thickness=2, alpha=0.6)   # Red taillights

    # 3. TITANIC MEKANISK KRAKEN BIOLUMINESCENT TENTACLES RISING FROM THE SEA
    # Tentacle 1 (Left, x=220, rising to y=260)
    kraken_base = (14, 50, 65)
    kraken_cyan = (0, 240, 255)
    
    # Left Tentacle
    t1_pts = [(160, 520), (180, 420), (220, 340), (280, 270), (250, 260), (200, 330), (160, 430), (130, 520)]
    c.draw_polygon(t1_pts, kraken_base)
    # Glowing cyber-runes along tentacle
    for tx, ty in [(170, 450), (200, 370), (240, 300)]:
        c.draw_glow_circle(tx, ty, 14, kraken_cyan, alpha=0.7)
        c.draw_circle(tx, ty, 5, (255, 255, 255), alpha=1.0)

    # Right Huge Tentacle (Curling over Bridge, x=1150)
    t2_pts = [(1100, 520), (1140, 400), (1180, 310), (1250, 220), (1220, 210), (1150, 290), (1110, 390), (1070, 520)]
    c.draw_polygon(t2_pts, kraken_base)
    for tx, ty in [(1120, 440), (1150, 340), (1200, 250)]:
        c.draw_glow_circle(tx, ty, 16, kraken_cyan, alpha=0.75)
        c.draw_circle(tx, ty, 6, (255, 255, 255), alpha=1.0)

    # Center Kraken Head / Eye Behemoth silhouette underwater
    c.draw_glow_circle(680, 540, 160, (0, 220, 255), alpha=0.45)
    c.draw_glow_circle(680, 540, 70, (255, 40, 40), alpha=0.6) # Menacing crimson eye

    # 4. Violent Churning Kattegat Sea Water (y: 500 to 768)
    sea_stops = [
        (500, (14, 45, 65)),
        (560, (10, 32, 50)),
        (640, (6, 20, 35)),
        (768, (2, 10, 20))
    ]
    c.draw_vertical_gradient(500, 768, sea_stops)

    # White Foam Waves & Lightning Reflections
    for wy in range(505, 768, 12):
        for _ in range(12):
            wx = random.randint(0, WIDTH - 120)
            c.draw_line(wx, wy, wx + random.randint(30, 90), wy, (200, 240, 255), thickness=2, alpha=0.4)
            c.draw_line(wx + 10, wy + 2, wx + random.randint(20, 50), wy + 2, (0, 220, 255), thickness=1, alpha=0.35)

    c.save_jpg('assets/goteborg-4.jpg')

if __name__ == '__main__':
    render_goteborg_1()
    render_goteborg_2()
    render_goteborg_3()
    render_goteborg_4()
    print("ALL SUB-LEVEL BACKGROUNDS GENERATED SUCCESSFULLY!")

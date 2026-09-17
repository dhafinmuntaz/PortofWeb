#!/usr/bin/env python3
"""
Zero-dependency Local Development Server for PortofWeb Architecture Portfolio.
Serves static assets and provides live disk-saving endpoints for admin.html.
Run: python server.py
"""

import http.server
import socketserver
import json
import os
import sys
import re

PORT = 3000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

os.makedirs(DATA_DIR, exist_ok=True)

def sync_projects_with_images():
    """Scans images/Project and updates data/projects.json while preserving edited metadata."""
    proj_dir = os.path.join(BASE_DIR, "images", "Project")
    projects_file = os.path.join(DATA_DIR, "projects.json")
    if not os.path.isdir(proj_dir):
        return []

    existing = []
    if os.path.exists(projects_file):
        try:
            with open(projects_file, "r", encoding="utf-8") as f:
                existing = json.load(f)
        except Exception:
            existing = []

    existing_by_title = {p.get("title", "").strip().lower(): p for p in existing}
    existing_by_slug = {p.get("slug", "").strip().lower(): p for p in existing}
    existing_by_folder = {}
    for p in existing:
        cov = p.get("coverImage", "")
        if "images/Project/" in cov:
            sub = cov.split("images/Project/")[1]
            f_name = sub.split("/")[0] if "/" in sub else ""
            if f_name:
                existing_by_folder[f_name.strip().lower()] = p

    def natural_sort_key(s):
        return [int(t) if t.isdigit() else t.lower() for t in re.split(r'(\d+)', s)]

    folders = sorted([d for d in os.listdir(proj_dir) if os.path.isdir(os.path.join(proj_dir, d))])
    synced = []

    for idx, folder_name in enumerate(folders):
        folder_path = os.path.join(proj_dir, folder_name)
        imgs = [img for img in os.listdir(folder_path) if img.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]
        imgs.sort(key=natural_sort_key)
        img_paths = [f"images/Project/{folder_name}/{img}" for img in imgs]
        cover_img = img_paths[0] if img_paths else "images/tm-620-com-01.jpg"

        title = folder_name
        slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
        matched = (
            existing_by_folder.get(folder_name.lower())
            or existing_by_title.get(title.lower())
            or existing_by_slug.get(slug)
        )

        proj_id = f"proj-{str(idx + 1).zfill(2)}"
        if matched:
            proj = dict(matched)
            proj["coverImage"] = cover_img
            proj["galleryImages"] = img_paths
            synced.append(proj)
        else:
            synced.append({
                "id": proj_id,
                "slug": slug,
                "title": title,
                "spine": title.split()[0],
                "category": "Architecture",
                "type": "Architecture & Spatial Design",
                "year": "2025",
                "client": "Private Client",
                "role": "Principal Architect",
                "location": "Indonesia",
                "area": "500 sqm",
                "materials": "Board-formed concrete, stone, timber, glass",
                "coverImage": cover_img,
                "galleryImages": img_paths,
                "description": "Architectural project balancing spatial massing, natural daylight, and tectonic honesty.",
                "details": "Custom bespoke details and sustainable passive environmental design."
            })

    with open(projects_file, "w", encoding="utf-8") as f:
        json.dump(synced, f, indent=2, ensure_ascii=False)
    return synced

class PortfolioHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS and disable caching during development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path == '/api/sync-projects':
            try:
                synced = sync_projects_with_images()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "ok", "count": len(synced), "projects": synced}).encode('utf-8'))
                print(f"[SUCCESS] Synced {len(synced)} projects with images/Project.")
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
                print(f"[ERROR] Failed to sync projects: {e}")
        else:
            super().do_GET()

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        if self.path == '/api/sync-projects':
            try:
                synced = sync_projects_with_images()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "ok", "count": len(synced), "projects": synced}).encode('utf-8'))
                print(f"[SUCCESS] Synced {len(synced)} projects with images/Project.")
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
                print(f"[ERROR] Failed to sync projects: {e}")

        elif self.path == '/api/save-projects':
            try:
                data = json.loads(post_data.decode('utf-8'))
                file_path = os.path.join(DATA_DIR, "projects.json")
                with open(file_path, "w", encoding="utf-8") as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"status":"ok","message":"Projects saved directly to disk"}')
                print(f"[SUCCESS] Updated {file_path} with {len(data)} projects.")
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
                print(f"[ERROR] Failed to save projects: {e}")

        elif self.path == '/api/save-profile':
            try:
                data = json.loads(post_data.decode('utf-8'))
                file_path = os.path.join(DATA_DIR, "profile.json")
                with open(file_path, "w", encoding="utf-8") as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"status":"ok","message":"Profile saved directly to disk"}')
                print(f"[SUCCESS] Updated {file_path} with architect profile.")
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
                print(f"[ERROR] Failed to save profile: {e}")
        else:
            self.send_response(404)
            self.end_headers()

def run_server():
    os.chdir(BASE_DIR)
    # Automatically sync projects with images folder on startup
    try:
        synced = sync_projects_with_images()
        print(f"[STARTUP] Synchronized {len(synced)} projects from images/Project")
    except Exception as e:
        print(f"[STARTUP] Auto-sync notice: {e}")

    handler = PortfolioHandler
    
    # Try PORT or fallback if in use
    for port in [3000, 8080, 8000, 5000]:
        try:
            with socketserver.TCPServer(("", port), handler) as httpd:
                print("=" * 60)
                print(f" PORTFOLIO & ADMIN CMS LOCAL SERVER RUNNING")
                print("=" * 60)
                print(f"  Main Gallery:  http://localhost:{port}/index.html")
                print(f"  About Detail:  http://localhost:{port}/about.html")
                print(f"  Admin CMS:     http://localhost:{port}/admin.html")
                print("=" * 60)
                print("  Disk synchronization is active for data/projects.json")
                print("  Press Ctrl+C to stop the server.")
                print("=" * 60)
                sys.stdout.flush()
                httpd.serve_forever()
                break
        except OSError:
            continue

if __name__ == "__main__":
    run_server()


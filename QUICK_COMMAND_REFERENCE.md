# Taekwondo App - Quick Command Reference Guide

**Created by**: Kamran Bhutto
**Last Updated**: December 1, 2025
**For**: Future Development & Deployment Issues

---

## ⚠️ CRITICAL: Before Every Production Deployment

**This step was skipped in the last deployment cycle, causing frontend updates to not be visible. ALWAYS do this:**

```bash
# On your LOCAL development machine:
npm run build
git add public/build/
git commit -m "Rebuild frontend assets"
git push origin main
```

**Why this matters**: The `public/build/` directory contains compiled JavaScript/CSS. If you push code changes without rebuilding, the frontend won't show updates to users.

---

## 🚀 STANDARD DEPLOYMENT FLOW (Use This Every Time)

### Local Machine (Before pushing):
```bash
# 1. Build frontend assets
npm run build

# 2. Stage and commit the built assets
git add public/build/
git commit -m "Rebuild frontend assets - [brief description of changes]"

# 3. Push to GitHub
git push origin main
```

### Production Server (After pushing):
```bash
# 1. Navigate to project directory
cd ~/taekwondo.kbsolutions.agency

# 2. Pull latest code (includes compiled assets)
git pull origin main

# 3. Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan route:clear

# 4. Verify everything
curl http://taekwondo.kbsolutions.agency/ 2>&1 | head -20
```

---

## 🔴 If Frontend Updates Not Showing (User can't see new features)

**Checklist**:
- [ ] Did you run `npm run build` on local machine? ✅ REQUIRED
- [ ] Did you commit and push `public/build/` to GitHub? ✅ REQUIRED
- [ ] Did you git pull on the server?
- [ ] Did user hard-refresh browser?

**If still not showing, run these on server**:
```bash
cd ~/taekwondo.kbsolutions.agency

# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan route:clear

# Check if build files exist and are recent
ls -lah public/build/manifest.json

# Verify git pull was successful
git log --oneline -5
```

**User's Browser Fix**:
- Windows: `Ctrl + Shift + R` (hard refresh)
- Mac: `Cmd + Shift + R` (hard refresh)
- Or: Open DevTools (F12) → Settings → Clear browser cache → Hard refresh

---

## 🔧 Database Issues

### If Seeding Fails:
```bash
cd ~/taekwondo.kbsolutions.agency

# Clear autoloader cache
composer dump-autoload

# Run seeder
php artisan db:seed --class=ComprehensiveDummyDataSeeder
```

### If Migrations Failed:
```bash
cd ~/taekwondo.kbsolutions.agency

# Check what happened
php artisan migrate:status

# Force run migrations
php artisan migrate --force

# Then seed
php artisan db:seed --class=ComprehensiveDummyDataSeeder
```

### If You Need Fresh Database (Development Only):
```bash
cd ~/taekwondo.kbsolutions.agency

# WARNING: This deletes all data!
php artisan migrate:fresh --seed
```

---

## ✅ Verification Commands (Run After Any Deployment)

```bash
# Check students count (should be 150)
mysql -h localhost -u kbsoluti_taekwondo -p kbsoluti_taekwondo -e "SELECT COUNT(*) as 'Total Students' FROM students;"

# Check bank information (should be 20)
mysql -h localhost -u kbsoluti_taekwondo -p kbsoluti_taekwondo -e "SELECT COUNT(*) as 'Bank Records' FROM bank_information;"

# Check grades (should be 7+)
mysql -h localhost -u kbsoluti_taekwondo -p kbsoluti_taekwondo -e "SELECT COUNT(*) as 'Grades' FROM grades;"

# Check organizations (should be 5)
mysql -h localhost -u kbsoluti_taekwondo -p kbsoluti_taekwondo -e "SELECT COUNT(*) as 'Organizations' FROM organizations;"

# Check clubs (should be 15)
mysql -h localhost -u kbsoluti_taekwondo -p kbsoluti_taekwondo -e "SELECT COUNT(*) as 'Clubs' FROM clubs;"
```

---

## 📋 Common Issues & Fixes

### Issue: 500 Server Error on Pages
```bash
# Check Laravel logs
tail -50 storage/logs/laravel.log

# Clear everything and retry
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan route:clear

# If still failing, check database connection
php artisan tinker
# In tinker: DB::connection()->getPDO();
```

### Issue: "No results" or Empty Pages (But data exists)
**Likely cause**: Controller is querying wrong model class

**Example**: Bank Information showing "No results"
```bash
# Verify data exists
mysql -h localhost -u kbsoluti_taekwondo -p kbsoluti_taekwondo -e "SELECT userable_type, COUNT(*) FROM bank_information GROUP BY userable_type;"

# Should show:
# App\Models\Club - 15 records
# App\Models\Organization - 5 records
```

**If query shows different model class (e.g., App\Models\User)**, the controller is using wrong class:
```bash
grep -n "User::class" app/Http/Controllers/Club/BankInformationController.php
# Should NOT find User::class, should be Club::class
```

### Issue: TypeScript Build Errors
```bash
# Check build output
npm run build 2>&1 | grep -i error

# Common errors:
# 1. Router method signature - check router.put() vs put()
# 2. Type mismatches - check @ts-ignore or fix types
# 3. Missing components - check imports

# Fix and rebuild
npm run build
```

### Issue: Composer/NPM Dependency Issues
```bash
# For Composer
composer install --no-dev --optimize-autoloader

# For NPM
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 🔐 Database Credentials (On Production Server)

```
Host: localhost
Database: kbsoluti_taekwondo
Username: kbsoluti_taekwondo
Password: (check .env file)
```

---

## 👤 Test Login Credentials (After Seeding)

```
Admin:
  Email: admin@example.com
  Password: password

Organization (Org 1):
  Email: org1@example.com
  Password: password

Club (Club 1):
  Email: club1@example.com
  Password: password

Student (Student 1):
  Email: student1@example.com
  Password: password

Instructor (Instructor 1):
  Email: instructor1@example.com
  Password: password
```

---

## 📞 Quick Reference URLs

```
Production: https://taekwondo.kbsolutions.agency
Local Dev: http://127.0.0.1:8000

Key Pages:
- Organization Grade Reports: /organization/grade-reports
- Club Grade Reports: /club/grade-reports
- Student Grade Report: /student/grade-report
- Organization Bank Info: /organization/bank-information
- Club Bank Info: /club/bank-information
- Admin Bank Info: /admin/bank-information
```

---

## 📚 Complete Documentation Files

- **DEPLOYMENT_GUIDE.md** - Full deployment instructions with explanations
- **SERVER_DEPLOYMENT_COMMANDS.md** - Step-by-step server commands
- **PROJECT_FILES_CHECKLIST.md** - Complete inventory of all files and features

---

## 🎯 Summary: What To Do "If Anything Happens"

**Step 1: Identify the problem**
- Frontend not updating? → Build assets (npm run build)
- Database errors? → Run migrations/seeding
- 500 error? → Check logs
- Page showing no data? → Verify database has records

**Step 2: For Frontend Issues**:
```bash
# Local machine
npm run build
git add public/build/
git commit -m "Rebuild assets"
git push origin main

# Server
cd ~/taekwondo.kbsolutions.agency
git pull origin main
php artisan cache:clear
php artisan view:clear
```

**Step 3: For Database Issues**:
```bash
cd ~/taekwondo.kbsolutions.agency
composer dump-autoload
php artisan migrate --force
php artisan db:seed --class=ComprehensiveDummyDataSeeder
```

**Step 4: Verify**:
```bash
# Check counts match expected values
mysql -h localhost -u kbsoluti_taekwondo -p kbsoluti_taekwondo -e "SELECT COUNT(*) FROM students;"
# Should return 150
```

---

**Created by**: Kamran Bhutto with AI assistance
**Author & Owner**: Kamran Bhutto
**Email**: kamranbhutto@gmail.com
**Repository**: https://github.com/hasnat-kbsolutions/taekwondo

*This guide was requested by Kamran Bhutto and compiled from his direct experience in solving deployment issues on December 1, 2025.*

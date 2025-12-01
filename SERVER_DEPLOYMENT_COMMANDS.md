# Server Deployment - Step by Step Commands

## RUN THESE EXACT COMMANDS ON YOUR SERVER:

### **Step 1: Fix Git Pull (Remove Untracked Cache Files)**
```bash
cd ~/taekwondo.kbsolutions.agency
rm -rf bootstrap/cache/*
git pull origin main
```

### **Step 2: Install Dependencies**
```bash
composer install --no-dev --optimize-autoloader
```

### **Step 3: Update Environment File (if needed)**
```bash
cp .env.example .env
# Then edit .env with your database settings
nano .env
```

### **Step 4: Run Migrations**
```bash
php artisan migrate --force
```

### **Step 5: Seed Database**
```bash
php artisan db:seed --class=ComprehensiveDummyDataSeeder
```

### **Step 6: Optimize Application**
```bash
php artisan optimize
php artisan config:cache
php artisan route:cache
```

### **Step 7: Set Permissions**
```bash
chmod -R 775 storage bootstrap/cache
chown -R nobody:nobody storage bootstrap/cache
```

### **Step 8: Verify Everything**
```bash
# Check if seeder worked
mysql -h localhost -u your_db_user -p your_db_name -e "SELECT COUNT(*) FROM students;"
# Should return 150

mysql -h localhost -u your_db_user -p your_db_name -e "SELECT COUNT(*) FROM bank_information;"
# Should return 20
```

---

## IF YOU GET ERRORS:

### **Error: "Target class [Database\Seeders\ComprehensiveDummyDataSeeder] does not exist"**
**Solution:** Run these commands:
```bash
cd ~/taekwondo.kbsolutions.agency
composer dump-autoload
php artisan db:seed --class=ComprehensiveDummyDataSeeder
```

### **Error: "Nothing to migrate"**
**This is NORMAL** - means migrations already ran. Continue with seeding.

### **Error: npm not found**
**This is FINE** - npm is only for development. Assets are already built.

---

## QUICK VERSION (All Commands at Once)

```bash
cd ~/taekwondo.kbsolutions.agency && \
rm -rf bootstrap/cache/* && \
git pull origin main && \
composer install --no-dev --optimize-autoloader && \
php artisan migrate --force && \
php artisan db:seed --class=ComprehensiveDummyDataSeeder && \
php artisan optimize && \
php artisan config:cache && \
php artisan route:cache && \
chmod -R 775 storage bootstrap/cache && \
echo "Deployment complete!"
```

---

## WHAT GETS SEEDED:
- ✅ 5 Organizations
- ✅ 15 Clubs (3 per organization)
- ✅ 150 Students (10 per club)
- ✅ 20 Bank Accounts (5 org + 15 club)
- ✅ 7+ Grades
- ✅ 25+ Student Fee Plans
- ✅ All user accounts for testing

---

## VERIFY DEPLOYMENT SUCCESS:

```bash
# Check users created
mysql -h localhost -u user -p database -e "SELECT COUNT(*) as 'User Count' FROM users;"

# Check students created
mysql -h localhost -u user -p database -e "SELECT COUNT(*) as 'Student Count' FROM students;"

# Check bank info
mysql -h localhost -u user -p database -e "SELECT COUNT(*) as 'Bank Records' FROM bank_information;"

# Check grades
mysql -h localhost -u user -p database -e "SELECT COUNT(*) as 'Grade Count' FROM grades;"
```

Expected results:
- User Count: 26+ (5 org admins + 15 club admins + 5 instructors + etc)
- Student Count: 150
- Bank Records: 20
- Grade Count: 7+

---

## LOGIN TEST CREDENTIALS (After Seeding):

**Admin:**
- Email: admin@example.com
- Password: password

**Organization:**
- Email: org1@example.com
- Password: password

**Club:**
- Email: club1@example.com
- Password: password

**Student:**
- Email: student1@example.com
- Password: password

**Instructor:**
- Email: instructor1@example.com
- Password: password

---

## TROUBLESHOOTING:

If you still have issues, try these:

```bash
# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan view:clear
php artisan route:clear

# Regenerate autoloader
composer dump-autoload

# Re-optimize
php artisan optimize
```

Then try seeding again:
```bash
php artisan db:seed --class=ComprehensiveDummyDataSeeder
```

---

**Questions?** Check DEPLOYMENT_GUIDE.md for more details.

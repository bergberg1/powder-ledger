#!/bin/sh
cd "$(dirname "$0")"
{ cat 01_head.html; echo '<script>'; cat 00_locations.js 00b_cams.js 02_core.js 03_ui.js 05_extras.js 06_cams.js 04_boot.js; echo '</script>'; echo '</body></html>'; } > "../Powder Ledger.html"
python3 - <<'EOF'
import re
h=open('01_head.html').read()
head=re.search(r'(<title>.*?</style>)', h, re.S).group(1)
body=re.search(r'<body>(.*)$', h, re.S).group(1)
js=''.join(open(f).read() for f in ['00_locations.js','00b_cams.js','02_core.js','03_ui.js','05_extras.js','06_cams.js','04_boot.js'])
open('../artifact/index.html','w').write(head+'\n'+body+'\n<script>\n'+js+'\n</script>\n')
EOF
{ cat 00_locations.js 00b_cams.js 02_core.js 03_ui.js 05_extras.js 06_cams.js 04_boot.js; } > /tmp/pl_check.js
node --check /tmp/pl_check.js && echo "syntax ok" && wc -c "../Powder Ledger.html" ../artifact/index.html

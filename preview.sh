find . -depth -type f -name 'docusaurus.config.js' -exec sed -i "s/baseUrl: '/baseUrl: '\/preview\/pr-$1/" {} \;

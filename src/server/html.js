export default function html(options) {
  const {
    app = 'main',
    title = 'Lintellect',
    stylesheet = '/css/style.css',
    markup,
    initialState
  } = options;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <!--
            <link rel="stylesheet" type="text/css" href="semantic/dist/semantic.min.css">
        -->
        <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
        <link rel="stylesheet" href="${stylesheet}" />
      </head>
      <body>
        <div id="root">${markup}</div>


        <!--
          <script
            src="https://code.jquery.com/jquery-3.1.1.min.js"
            integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8="
            crossorigin="anonymous"></script>
          <script src="semantic/dist/semantic.min.js"></script>
        -->

        <script>
          window.initialState = ${JSON.stringify(initialState)};
        </script>
        <script src="/app/vendor.bundle.js"></script>
        <script src="/app/${app}.bundle.js"></script>
      </body>
    </html>
  `;
}

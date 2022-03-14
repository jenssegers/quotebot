import Head from 'next/head';

const Layout = ({ ...props }) => (
	<>
		<Head>
			<title>Quotebot</title>
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<meta charSet="utf-8" />
		</Head>

		<style jsx global>
			{`
				* {
					box-sizing: border-box;
				}

				html,
				body,
				#__next {
					height: 100%;
					width: 100%;
				}

				body {
					margin: 0;
					padding: 0;
					font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
						'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
					-webkit-font-smoothing: antialiased;
					-moz-osx-font-smoothing: grayscale;
					background-color: #f2f2f8;
				}

				p {
					margin: 0;
				}
			`}
		</style>

		{props.children}

		<script
			async
			defer
			data-website-id="d4bf37a0-d54d-453a-b2f8-6538d9006b7f"
			src="https://umami.jenssegers.com/umami.js"
		></script>
	</>
);

export default Layout;

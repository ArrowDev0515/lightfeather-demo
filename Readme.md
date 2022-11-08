- Install Git

- Install Docker

- Download source code from github

		git clone https://github.com/royalflash5150/lightfeather-demo.git
	
- Start server

	Go to directory you cloned.
	
		cd /lightfeather-demo
	
	Start docker compose.	
	
		docker compose --env-file .env up
	
	if start docker compose in background mode, you can use below command.
	
		docker compose --env-file .env -d up	


	After few minutes, you can visit "http://localhost:3000".
	

# Pong

## Start server

```bash
./build.sh
```

## Stop server

```bash
docker compose down
```

## dotenv
```
export DEP_MODE=production
export DJANGO_SECRET_KEY=...

# DATABASE
export POSTGRES_DB=django
export POSTGRES_USER=django
export POSTGRES_PASSWORD=django
export POSTGRES_HOST=postgresql
export POSTGRES_PORT=5432

# REDIS
export REDIS_HOST=redis
export REDIS_PORT=6379

# OAUTH
# 42 OAUTH
export OAUTH_CLIENT_UID=...
export OAUTH_CLIENT_SECRET=...
export OAUTH_TOKEN_URL=https://api.intra.42.fr/oauth/token/
export API_USER_INFOS_URL=https://api.intra.42.fr/v2/me/
export EMAIL_HOST='smtp.gmail.com'
export EMAIL_HOST_USER='transcendance2042@gmail.com'
export EMAIL_FROM='transcendance2042@gmail.com'
export EMAIL_HOST_PASSWORD='wanh xhid guvr cgik'


# twilio
export TWILIO_ACCOUNT_SID=...
export TWILIO_AUTH_TOKEN=...
export TWILIO_VERIFY_SID=...

export VITE_42_OAUTH_CLIENT_UID=...
export VITE_42_OAUTH_CLIENT_SECRET=...
```

## Authors
<table>
	<tr>
		<td> <img style="width:100px;height:100px;" src="https://avatars.githubusercontent.com/u/109520884?v=4"> </td>
		<td> <img style="width:100px;height:100px;" src="https://avatars.githubusercontent.com/u/106318602?v=4"> </td>
		<td> <img style="width:100px;height:100px;" src="https://avatars.githubusercontent.com/u/53295397?v=4"> </td>
		<td> <img style="width:100px;height:100px;" src="https://avatars.githubusercontent.com/u/28073539?v=4"> </td>
	</tr>
	<tr>
		<td style="text-align:center"> <a href="https://github.com/Fidget836">tmarie</a> </td>
		<td style="text-align:center"> <a href="https://github.com/Tandrya">mlaval</a> </td>
		<td style="text-align:center"> <a href="https://github.com/emolina7">ermolina</a> </td>
		<td style="text-align:center"> <a href="https://github.com/malletgaetan">gmallet</a> </td>
	</tr>
</table>

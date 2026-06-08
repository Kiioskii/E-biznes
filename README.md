Maciej Kijowski <br>
E-biznes 2026<br>
DokerHub: https://hub.docker.com/repositories/kiioskii<br><br>

**ZADANIE 1** <br>
3.0 obraz ubuntu z Pythonem w wersji 3.10 [--->](https://github.com/Kiioskii/E-biznes/tree/main/cw1/zad1) <br>
3.5 obraz ubuntu:24.02 z Javą w wersji 8 oraz Kotlinem [--->](https://github.com/Kiioskii/E-biznes/tree/main/cw1/zad2)<br>
4.0 do powyższego należy dodać najnowszego Gradle’a oraz paczkę JDBC
SQLite w ramach projektu na Gradle (build.gradle) [--->](https://github.com/Kiioskii/E-biznes/tree/main/cw1/zad3) <br>
4.5 stworzyć przykład typu HelloWorld oraz uruchomienie aplikacji
przez CMD oraz gradle [--->](https://github.com/Kiioskii/E-biznes/tree/main/cw1/zad4) <br>
5.0 dodać konfigurację docker-compose [--->](https://github.com/Kiioskii/E-biznes/blob/main/cw1/zad4/docker-compose.yaml)<br><br>

------------------------------------------------------------<br><br>
**ZADANIE 2** <br>
3.0 Należy stworzyć kontroler do Produktów [--->](https://github.com/Kiioskii/E-biznes/tree/0c06c8adc7d869b5782d92b39ab707f0137ee99a)<br> 
3.5 Do kontrolera należy stworzyć endpointy zgodnie z CRUD - dane pobierane z listy [--->](https://github.com/Kiioskii/E-biznes/tree/994d3fd88fd6676779e308befa1f22af1915c05a) <br> 
4.0 Należy stworzyć kontrolery do Kategorii oraz Koszyka + endpointy zgodnie z CRUD [--->](https://github.com/Kiioskii/E-biznes/tree/43d4a181ccb1b2946bc58261073d0cede1648e1b)<br>
4.5 Należy aplikację uruchomić na dockerze (stworzyć obraz) oraz dodać skrypt uruchamiający aplikację via ngrok [--->](https://github.com/Kiioskii/E-biznes/tree/0122e09e387b5d180ca3d69d89c1c4313a7aa6c0) <br>
5.0 Należy dodać konfigurację CORS dla dwóch hostów dla metod CRUD [--->](https://github.com/Kiioskii/E-biznes/tree/eda343cf9af4a567930a1d5a4d889f57b3432290)<br><br>

------------------------------------------------------------<br><br>
**ZADANIE 3** <br>
3.0 Należy stworzyć aplikację kliencką w Kotlinie we frameworku Ktor,
która pozwala na przesyłanie wiadomości na platformę Discord [-->](https://github.com/Kiioskii/E-biznes/tree/5e3f6a67eeccafb2c36a008669b8c057d72ff137)<br>
3.5 Aplikacja jest w stanie odbierać wiadomości użytkowników z
platformy Discord skierowane do aplikacji (bota) [-->](https://github.com/Kiioskii/E-biznes/tree/5e3f6a67eeccafb2c36a008669b8c057d72ff137)<br>
4.0 Zwróci listę kategorii na określone żądanie użytkownika [-->](https://github.com/Kiioskii/E-biznes/tree/d6db8ea231a9d57a8cae0e0c0b6bb704c56c07d3)<br>
4.5 Zwróci listę produktów wg żądanej kategorii[-->](https://github.com/Kiioskii/E-biznes/tree/d6db8ea231a9d57a8cae0e0c0b6bb704c56c07d3)<br>
5.0 Aplikacja obsłuży dodatkowo jedną z platform: Slack [-->](https://github.com/Kiioskii/E-biznes/tree/d6db8ea231a9d57a8cae0e0c0b6bb704c56c07d3)<br><br>

------------------------------------------------------------<br><br>
**ZADANIE 4** <br>

3.0 Należy stworzyć aplikację we frameworki echo w j. Go, która będzie
miała kontroler Produktów zgodny z CRUD [-->](https://github.com/Kiioskii/E-biznes/tree/5d0d95ec245fe4bff26ff6d3bc337bbe8ceadbd6)<br>

3.5 Należy stworzyć model Produktów wykorzystując gorm oraz
wykorzystać model do obsługi produktów (CRUD) w kontrolerze (zamiast
listy) [-->](https://github.com/Kiioskii/E-biznes/tree/22bbfc2706aeda11586c7bea5e3dbc1b968da61f)<br>
4.0 Należy dodać model Koszyka oraz dodać odpowiedni endpoint [-->](https://github.com/Kiioskii/E-biznes/tree/9d8e3d3c22044c73eb000c59dff98d5036b20093)<br>
4.5 Należy stworzyć model kategorii i dodać relację między kategorią,
a produktem [-->](https://github.com/Kiioskii/E-biznes/tree/b7814fc4863bd159bcdb641369e347dffe5ed06e)<br><br>

------------------------------------------------------------<br><br>
**ZADANIE 5** <br>

3.0 W ramach projektu należy stworzyć dwa komponenty: Produkty oraz
Płatności; Płatności powinny wysyłać do aplikacji serwerowej dane, a w
Produktach powinniśmy pobierać dane o produktach z aplikacji
serwerowej; [-->](https://github.com/Kiioskii/E-biznes/tree/11a034d38215175ee76eaa876942f06ef5ca6df3)<br>
3.5 Należy dodać Koszyk wraz z widokiem; należy wykorzystać routing [-->](https://github.com/Kiioskii/E-biznes/tree/412921256936086dc6f6e57151e203bb12c474fc)<br>
4.0 Dane pomiędzy wszystkimi komponentami powinny być przesyłane za
pomocą React hooks [-->](https://github.com/Kiioskii/E-biznes/tree/412921256936086dc6f6e57151e203bb12c474fc)<br>
4.5 Należy dodać skrypt uruchamiający aplikację serwerową oraz
kliencką na dockerze via docker-compose [-->](https://github.com/Kiioskii/E-biznes/tree/412921256936086dc6f6e57151e203bb12c474fc)<br>
5.0 Należy wykorzystać axios’a oraz dodać nagłówki pod CORS [-->](https://github.com/Kiioskii/E-biznes/tree/14e9582966b1b4861cb753773409f7b3c499a7b4)<br><br>

------------------------------------------------------------<br><br>
**ZADANIE 6** <br>
3.0 Należy stworzyć 20 przypadków testowych w CypressJS [-->](https://github.com/Kiioskii/E-biznes/tree/06950e8c7ad860f24c38edb5669f511980720829)<br>
3.5 Należy rozszerzyć testy funkcjonalne, aby zawierały minimum 50
asercji [-->](https://github.com/Kiioskii/E-biznes/tree/628db7a958320c87f3ba9145689d9bcb58725907)<br>
4.0 Należy stworzyć testy jednostkowe do wybranego wcześniejszego
projektu z minimum 50 asercjami[-->](https://github.com/Kiioskii/E-biznes/tree/628db7a958320c87f3ba9145689d9bcb58725907)<br>
4.5 Należy dodać testy API, należy pokryć wszystkie endpointy z
minimum jednym scenariuszem negatywnym per endpoint [-->](https://github.com/Kiioskii/E-biznes/tree/8f11ad769cc15bab715185b9f97751331439b551)<br><br>

------------------------------------------------------------<br><br>
**ZADANIE 7** <br>
W tym zadaniu stworzyłem dwa osobne repozytoria, odpowiednio do frontendu(React) i backendu(Kotlin)<br>
Frontend [-->](https://github.com/Kiioskii/E-biznes-fornt)<br>
Backend [-->](https://github.com/Kiioskii/E-biznes-backend)<br>
Film pokazujacy działanie aplikacji [-->](https://drive.google.com/file/d/1vWBlzAJFyzH-hOfNduNWw5Zs-VdO-pam/view?usp=sharing)<br><br>
3.0 Należy dodać litera do odpowiedniego kodu aplikacji serwerowej w
hookach gita [-->](https://github.com/Kiioskii/E-biznes-backend/tree/f3ac92a736fc51682d9fb6d28ede28bdbab0baa0)<br>
3.5 Należy wyeliminować wszystkie bugi w kodzie w Sonarze (kod
aplikacji serwerowej) [-->](https://github.com/Kiioskii/E-biznes-backend/tree/be6b21c41b32d6a969184673166a4b0de3c7c153)<br>
4.0 Należy wyeliminować wszystkie zapaszki w kodzie w Sonarze (kod
aplikacji serwerowej) [-->](https://github.com/Kiioskii/E-biznes-backend/tree/be6b21c41b32d6a969184673166a4b0de3c7c153)<br>
4.5 Należy wyeliminować wszystkie podatności oraz błędy bezpieczeństwa
w kodzie w Sonarze (kod aplikacji serwerowej) [-->](https://github.com/Kiioskii/E-biznes-backend/tree/be6b21c41b32d6a969184673166a4b0de3c7c153)<br>
5.0 Należy wyeliminować wszystkie błędy oraz zapaszki w kodzie
aplikacji klienckiej [-->](https://github.com/Kiioskii/E-biznes-fornt/tree/489eccbbb6861ec72a6daf2c99bdfda99ff707f7)<br><br>

------------------------------------------------------------<br><br>
**ZADANIE 8** <br>
Projekt: forntend(React) + backend(Node.js+express)<br>
Film z działaniem aplikacji [-->](https://drive.google.com/file/d/14vcNvHcWq1vxTCakwdQqDrJooXOI1z8-/view?usp=sharing)<br><br>

3.0 logowanie przez aplikację serwerową (bez Oauth2) [-->](https://github.com/Kiioskii/E-biznes/tree/2e6a716cfc80d208155698589c24a814a97e8671)<br>
3.5 rejestracja przez aplikację serwerową (bez Oauth2) [-->](https://github.com/Kiioskii/E-biznes/tree/4360e5e66c7d0ff3092c9e0c1292539a8c1fa4a3)<br>
4.0 logowanie via Google OAuth2 [-->](https://github.com/Kiioskii/E-biznes/tree/9886cf2422eeaaa374bfdb1714ef7e541150a4eb)<br>
4.5 logowanie via Github OAuth2 [-->](https://github.com/Kiioskii/E-biznes/tree/b4cd9d637596d8d3c7d19d580e63acef3256ba04)<br>
5.0 zapisywanie danych logowania OAuth2 po stronie serwera [-->](https://github.com/Kiioskii/E-biznes/tree/b4cd9d637596d8d3c7d19d580e63acef3256ba04)<br><br>

------------------------------------------------------------<br><br>
**ZADANIE 9** <br>
Filma z działania aplikacji: [-->](https://drive.google.com/file/d/12jjynl0FyYZ-fVH5H_9X1IH_K1pCAPiK/view?usp=sharing)<br><br>

3.0 należy stworzyć po stronie serwerowej osobny serwis do łącznia z
chatGPT [-->](https://github.com/Kiioskii/E-biznes/tree/4d22bad259fc47d78cb477410be1a58f56a2f6a8)<br>
3.5 należy połączyć serwis z interfejsem frontendowym via serwis w
Kotlinie (zadanie 3) - discord + JS [-->](https://github.com/Kiioskii/E-biznes/tree/4d22bad259fc47d78cb477410be1a58f56a2f6a8)<br>
4.0 stworzyć listę 5 różnych otwarć oraz zamknięć rozmowy [-->](https://github.com/Kiioskii/E-biznes/tree/73efa1fa4b84831a1311f1b72865e6b4d792900d)<br>
4.5 filtrowanie po zagadnieniach związanych ze sklepem (np.
ograniczenie się jedynie do ubrań oraz samego sklepu) do GPT [-->](https://github.com/Kiioskii/E-biznes/tree/c783c26c44d83c433ad59d0825a185c7babf2429)<br><br>

------------------------------------------------------------<br><br>
**ZADANIE 10** <br>
Wdrożenie apliakcji backendowej do chmury - Microsoft Azure <br>
Link do aplikacji: https://ebiz.livelytree-63fc6161.germanywestcentral.azurecontainerapps.io <br>
Lista produktów: https://ebiz.livelytree-63fc6161.germanywestcentral.azurecontainerapps.io/api/products <br>
<br>
Integracja odbyła się za pośrednictwm dockera:<br>
Resource Group -> Container Registry<br><br>

3.0 Należy stworzyć odpowiednie instancje po stronie chmury na
dockerze

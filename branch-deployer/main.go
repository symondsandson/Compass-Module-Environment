package main

import(
	"log"
	// "os"
	"net/url"
	"net/http"
	"net/http/httputil"
	"github.com/gorilla/mux"
)

func main() {
	remote, err := url.Parse("http://tastehoneyco.com")
	router := mux.NewRouter()

	if err != nil {
		panic(err)
	}

	proxy := httputil.NewSingleHostReverseProxy(remote)
	router.Host("{app}.{branch}.quill.seieroe.no-ip.biz").
		   HandlerFunc(handler(proxy))

	http.Handle("/", router)
	err = http.ListenAndServe(":7777", nil)

	if err != nil {
		panic(err)
	}
}

func handler(proxy *httputil.ReverseProxy) func(http.ResponseWriter, *http.Request) {
	return func(writer http.ResponseWriter, request *http.Request) {
		vars := mux.Vars(request)
		log.Println(vars["branch"])
		proxy.ServeHTTP(writer, request)
	}
}

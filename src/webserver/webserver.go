// Package webserver
// Created by RTT.
// Author: teocci@yandex.com on 2022-Apr-26
package webserver

import (
	"embed"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/teocci/go-tsp-lib-web-ui/src/config"
	"log"
	"mime"
	"net/http"
)

const (
	formatAddress = "%s:%d"
)

var (
	f       embed.FS
	address = fmt.Sprintf(formatAddress, "", config.Data.Web.Port)
)

func Start() {
	gin.SetMode(gin.ReleaseMode)
	_ = mime.AddExtensionType(".js", "application/javascript")

	router := gin.Default()
	router.LoadHTMLGlob("web/templates/*")

	router.StaticFS("/css", http.Dir("web/static/css"))
	router.StaticFS("/js", http.Dir("web/static/js"))
	router.StaticFS("/img", http.Dir("web/static/img"))
	router.StaticFile("/main.html", "web/static/main.html")

	router.Use(CORSMiddleware())

	err := router.Run(address)
	if err != nil {
		log.Fatalln("Start HTTP Server error", err)
	}
}

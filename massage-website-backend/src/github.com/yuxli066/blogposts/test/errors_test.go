package test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"leo-blog-post/src/github.com/yuxli066/blogposts/app"

	"github.com/gavv/httpexpect/v2"
)

// Error Test Cases
var error_tcs errorTestCases = errorTestCases{
	{
		result:  "Tags parameter is required",
		queries: nil,
	},
	{
		result: "The sortBy parameter must be id, reads, likes, or popularity",
		queries: query{
			"tags":   "tech",
			"sortBy": "nil",
		},
	},
	{
		result: "The sortBy direction must be either asc or desc",
		queries: query{
			"tags":      "tech",
			"direction": "nil",
		},
	},
	{
		result: "The sortBy parameter must be id, reads, likes, or popularity",
		queries: query{
			"tags":      "tech",
			"sortBy":    "nil",
			"direction": "nil",
		},
	},
}

func TestErrorHandling(t *testing.T) {
	// http handler setup & initialize routes for application
	app := app.App{}
	app.Initialize()
	handler := app.GetHTTPHandler()

	// setup golang api test server
	server := httptest.NewServer(handler)
	defer server.Close()

	s := httpexpect.New(t, server.URL)

	// base path
	basePath := "/api/posts"

	for _, v := range error_tcs {
		if v.queries != nil {
			s.GET(basePath).WithQueryObject(v.queries).Expect().Status(http.StatusBadRequest).JSON().Object().ContainsKey("error").ValueEqual("error", v.result)
		} else {
			s.GET(basePath).Expect().Status(http.StatusBadRequest).JSON().Object().ContainsKey("error").ValueEqual("error", v.result)
		}
	}

}

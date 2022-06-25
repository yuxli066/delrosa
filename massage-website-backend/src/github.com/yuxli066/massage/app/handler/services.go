package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/smtp"
	"strings"
	"time"

	"delrosa/src/github.com/yuxli066/massage/app/email"

	"golang.org/x/oauth2/google"
	"google.golang.org/api/calendar/v3"
	"google.golang.org/api/option"
)

var emailClient email.Email = email.Email{
	CERTPATH:   "src/github.com/yuxli066/massage/certs/tlsCert.crt",
	SERVERNAME: "smtp-relay.gmail.com",
	SERVERPORT: 587,
	FROMEMAIL:  "paulli@delrosamassage.com",
	TOEMAIL:    "yuxli066@gmail.com",
}

// API health check
func GetHealthCheck(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Service is healthy!")
	respondJSON(w, http.StatusOK, map[string]bool{"success": true})
}

// Send appointment email out
func SendEmail(w http.ResponseWriter, r *http.Request) {
	var err error
	emailClient.SERVER, err = smtp.Dial(emailClient.GetServerUrl())
	if err != nil {
		log.Println(err.Error())
	}
	defer emailClient.SERVER.Close()

	b, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error reading body: %v", err)
		respondError(w, http.StatusBadRequest, "Cannot read request body")
		return
	}

	json.Unmarshal([]byte(b), &emailClient.EMAILBODY)

	emailClient.Execute()
	fmt.Println("Email Sent!")
	respondJSON(w, http.StatusOK, map[string]bool{"Email Sent": true})
}

// check for appointment availability
func CheckAvailability(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	b, err := ioutil.ReadFile("src/github.com/yuxli066/massage/certs/massage-calendar.json")
	if err != nil {
		log.Fatalf("Unable to read client secret file: %v", err)
	}

	config, err := google.JWTConfigFromJSON(b, calendar.CalendarScope)
	if err != nil {
		log.Fatalf("Unable to parse client secret file to config: %v", err)
	}
	config.Subject = "paulli@delrosamassage.com"

	client := config.Client(ctx)

	calendarService, err := calendar.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		log.Fatalf("Unable to retrieve Calendar client: %v", err)
	}

	t := time.Now().Format(time.RFC3339)
	events, err := calendarService.Events.List("primary").ShowDeleted(false).SingleEvents(true).TimeMin(t).MaxResults(10).OrderBy("startTime").Do()
	if err != nil {
		log.Fatalf("Unable to retrieve next ten of the user's events: %v", err)
	}

	fmt.Print("\n Upcoming events: \n\n")
	if len(events.Items) == 0 {
		fmt.Println("No upcoming events found.")
	} else {
		for _, item := range events.Items {
			date := strings.Split(item.Start.DateTime, "T")[0]
			time := strings.Split(item.Start.DateTime, "T")[1]
			fmt.Printf(" Event Name: %v \n Date: %v \n Event Time: %v\n\n", strings.Trim(item.Summary, " "), date, time)
		}
	}
}

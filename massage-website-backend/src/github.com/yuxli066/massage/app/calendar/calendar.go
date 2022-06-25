package calendar

import (
	"net/http"

	"google.golang.org/api/calendar/v3"
)

type GoogleCalendar struct {
	client  *http.Client
	service *calendar.Service
}

type GoogleCalendarService interface {
	getClient()
	getService()
	getEvents()
	setAppointment()
}

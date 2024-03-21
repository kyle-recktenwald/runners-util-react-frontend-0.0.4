export function getCurrentLocalISOString(userTimeZone) {
    const now = new Date();
    const options = {
      timeZone: userTimeZone,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false
    };
    const localISOString = now.toLocaleString('en-US', options)
      .replace(',', '')
      .replace(/\//g, '-')
      .replace(' ', 'T');

    const parts = localISOString.split('T');
    const datePart = parts[0];
    const timePart = parts[1];

    const dateComponents = datePart.split('-');
    const month = dateComponents[0];
    const day = dateComponents[1];
    const year = dateComponents[2];

    const formattedDate = `${year}-${month}-${day}`;

    const outputDateTime = `${formattedDate}T${timePart}`;

    return outputDateTime;
}

export function convertMilesToMeters(distance) {
    return parseFloat(distance) * 1609.34;
}

export function convertDurationToMilliseconds(duration) {
    return ((parseInt(duration.hours, 10) || 0) * 3600000) +
    ((parseInt(duration.minutes, 10) || 0) * 60000) +
    ((parseInt(duration.seconds, 10) || 0) * 1000);
}
  
  export function convertMetersToMiles(meters) {
    const miles = meters / 1609.34; // Convert meters to miles
    return miles.toFixed(2); // Return the result rounded to 2 decimal places
  }
  
  export function formatDuration(milliseconds) {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
  
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  export function formatTimestamp(timestamp) {
    if (!timestamp) {
      return "null";
    }
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    });
  }
  
# Token Refresh Implementation

This document describes the automatic token refresh system implemented to prevent users from being logged out when their session expires.

## Overview

The system now automatically refreshes JWT tokens before they expire, providing a seamless user experience without requiring manual re-authentication.

## Backend Changes

### 1. New Refresh Endpoint (`/api/auth/refresh`)

**File:** `qa-chatbot-backend/routes/auth.js`

- Added a new POST endpoint `/auth/refresh` that accepts an expired or valid JWT token
- The endpoint can decode expired tokens to extract user information
- Generates a new JWT token with the same user information
- Returns both the new token and updated user information

**Key Features:**
- Handles both valid and expired tokens
- Maintains backward compatibility with existing token structure
- Includes proper error handling and logging

## Frontend Changes

### 1. Token Manager (`tokenManager.js`)

**File:** `qa-chatbot-frontend/src/utils/tokenManager.js`

A comprehensive utility class that handles all token-related operations:

**Key Features:**
- **Automatic Token Refresh:** Checks token expiration every 5 minutes
- **Proactive Refresh:** Refreshes tokens 5 minutes before expiration
- **Page Focus Refresh:** Refreshes tokens when user returns to the page
- **Event System:** Dispatches custom events for UI updates
- **Singleton Pattern:** Ensures single instance across the application

**Methods:**
- `getToken()` - Retrieve current token
- `setToken(token)` - Store new token
- `clearToken()` - Remove token
- `isTokenExpired(token)` - Check if token is expired (with 5-minute buffer)
- `refreshToken()` - Manually refresh token
- `getTimeUntilExpiration()` - Get minutes until token expires

### 2. Enhanced API Interceptor (`api.js`)

**File:** `qa-chatbot-frontend/src/utils/api.js`

Updated axios interceptor to handle token refresh automatically:

**Request Interceptor:**
- Checks if token is expired before each request
- Automatically refreshes token if needed
- Attaches fresh token to request headers

**Response Interceptor:**
- Handles 401 errors (token expired)
- Automatically retries failed requests with refreshed token
- Dispatches session expired events when refresh fails

### 3. Updated Session Expired Modal

**File:** `qa-chatbot-frontend/src/components/modals/SessionExpiredModal.js`

Enhanced modal with better user experience:

**New Features:**
- "Try Again" button for manual token refresh
- Automatic modal dismissal when token is refreshed
- Better error messaging
- Loading states for refresh attempts

### 4. Session Status Indicator

**File:** `qa-chatbot-frontend/src/components/SessionStatus.js`

New component that provides visual feedback:

**Features:**
- Shows "Refreshing session..." when token is being refreshed
- Warns users when session expires in less than 30 minutes
- Non-intrusive notifications in top-right corner

### 5. Updated Components

All components that previously used `localStorage.clear()` now use `tokenManager.clearToken()`:

- `Chat.js`
- `ProfilePage.js`
- `SettingsPage.js`
- `AboutUsPage.js`
- `SessionExpiredModal.js`

## How It Works

### 1. Automatic Background Refresh

```javascript
// Token manager checks every 5 minutes
setInterval(() => {
  const token = this.getToken();
  if (token && this.isTokenExpired(token)) {
    this.refreshToken();
  }
}, 5 * 60 * 1000);
```

### 2. Request-Time Refresh

```javascript
// Before each API request
if (token && tokenManager.isTokenExpired(token)) {
  const refreshResult = await tokenManager.refreshToken();
  token = refreshResult.token;
}
```

### 3. Error Recovery

```javascript
// When API returns 401
if (error.response?.status === 401 && !originalRequest._retry) {
  const refreshResult = await tokenManager.refreshToken();
  originalRequest.headers.Authorization = `Bearer ${refreshResult.token}`;
  return instance(originalRequest);
}
```

## User Experience Improvements

### 1. Seamless Operation
- Users never see "session expired" messages during normal usage
- All API calls automatically retry with fresh tokens
- No interruption to user workflow

### 2. Visual Feedback
- Loading indicators during token refresh
- Warnings when session is about to expire
- Clear error messages when refresh fails

### 3. Fallback Options
- Manual "Try Again" button in session expired modal
- Graceful degradation to login page when refresh fails
- Maintains all existing logout functionality

## Security Considerations

### 1. Token Validation
- Expired tokens are still validated for user information
- New tokens maintain the same security level
- No sensitive data is exposed during refresh

### 2. Error Handling
- Failed refresh attempts clear the token
- No infinite retry loops
- Proper error logging for debugging

### 3. Session Management
- Tokens are refreshed proactively, not reactively
- 5-minute buffer prevents edge cases
- Page focus triggers additional validation

## Configuration

### Token Expiration
- Current: 1 day (24 hours)
- Refresh buffer: 5 minutes before expiration
- Check interval: 5 minutes

### Events
The system dispatches these custom events:
- `tokenRefreshing` - When refresh starts
- `tokenRefreshed` - When refresh succeeds
- `sessionExpired` - When refresh fails

## Testing

To test the implementation:

1. **Login** to the application
2. **Wait** for automatic refresh (check console logs)
3. **Make API calls** - should work seamlessly
4. **Check browser storage** - token should update automatically
5. **Test page focus** - should trigger refresh if needed

## Troubleshooting

### Common Issues

1. **Token not refreshing:**
   - Check browser console for errors
   - Verify API endpoint is accessible
   - Check network connectivity

2. **Infinite refresh loops:**
   - Check token format and expiration
   - Verify refresh endpoint response
   - Check for circular dependencies

3. **Session still expiring:**
   - Verify token manager is initialized
   - Check event listeners are attached
   - Verify API interceptor is working

### Debug Mode

Enable debug logging by adding to browser console:
```javascript
localStorage.setItem('debug', 'tokenManager');
```

## Future Enhancements

1. **Refresh Token Rotation:** Implement refresh token rotation for enhanced security
2. **Offline Support:** Cache refresh attempts for offline scenarios
3. **User Preferences:** Allow users to configure refresh behavior
4. **Analytics:** Track refresh success rates and user patterns
5. **Multi-tab Sync:** Synchronize token refresh across browser tabs

## Conclusion

This implementation provides a robust, user-friendly token refresh system that eliminates the need for manual re-authentication while maintaining security best practices. Users can now work uninterrupted for extended periods without worrying about session expiration.

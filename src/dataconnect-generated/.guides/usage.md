# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { getUser, listEvents, createBooking, updateBookingStatus, deleteBooking, createReview, updateReview, deleteReview, createTicket, updateTicketStatus } from '@dataconnect/generated';


// Operation GetUser: 
const { data } = await GetUser(dataConnect);

// Operation ListEvents: 
const { data } = await ListEvents(dataConnect);

// Operation CreateBooking:  For variables, look at type CreateBookingVars in ../index.d.ts
const { data } = await CreateBooking(dataConnect, createBookingVars);

// Operation UpdateBookingStatus:  For variables, look at type UpdateBookingStatusVars in ../index.d.ts
const { data } = await UpdateBookingStatus(dataConnect, updateBookingStatusVars);

// Operation DeleteBooking:  For variables, look at type DeleteBookingVars in ../index.d.ts
const { data } = await DeleteBooking(dataConnect, deleteBookingVars);

// Operation CreateReview:  For variables, look at type CreateReviewVars in ../index.d.ts
const { data } = await CreateReview(dataConnect, createReviewVars);

// Operation UpdateReview:  For variables, look at type UpdateReviewVars in ../index.d.ts
const { data } = await UpdateReview(dataConnect, updateReviewVars);

// Operation DeleteReview:  For variables, look at type DeleteReviewVars in ../index.d.ts
const { data } = await DeleteReview(dataConnect, deleteReviewVars);

// Operation CreateTicket:  For variables, look at type CreateTicketVars in ../index.d.ts
const { data } = await CreateTicket(dataConnect, createTicketVars);

// Operation UpdateTicketStatus:  For variables, look at type UpdateTicketStatusVars in ../index.d.ts
const { data } = await UpdateTicketStatus(dataConnect, updateTicketStatusVars);


```
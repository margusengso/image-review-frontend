# Image Review Frontend

Simple ReactJs Webapp.

Before running the app ensure that port 3000 is not is use.

---

## First run (setup)

```
npm install
npm run dev
```


## Consecutive run

```
npm run dev
```

## Running the app

location -> 
```
http://localhost:3000/
```

Google login is required to try the app.
For each Google user a separate app user is created for our "Image Review" app.
The list of image objects is downloaded once on database initiation from AWS S3 bucket.
Each user can view and edit each image label just once.

JWT is used for authentication, upon expiry a new Google login is required.

### For improvement.
I would work on the UX a bit to make it match better the described User Actions.
Implement "Back" functionality for image labeling.
Add dark theme and consider using SCSS for styles.
Develop summary page to see full statistics on your own and all the users labelling.
Make the summary in .json format downloadable.
Make necessary changes to enable users to re-evaluate their choices.

ATM Pushing to main branch initiates Actions to build the image on dockerhub, there are no separate environments implemented. This would be something to seriously consider.

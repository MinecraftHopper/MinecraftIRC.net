FROM debian:9

RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_11.x | bash -
RUN apt-get update
RUN apt-get install -y nodejs rubygems build-essential ruby-dev
RUN gem install bundler

COPY . /web/app
ENV NODE_ENV development
WORKDIR /web/app

RUN bundle install
RUN npm install && npm install -g gulp
RUN npm install uglify-loader what-input --save-dev
RUN gulp build --production

EXPOSE 4000
EXPOSE 3001

CMD ["gulp", "serve"]
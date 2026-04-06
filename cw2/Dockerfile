# syntax=docker/dockerfile:1
FROM eclipse-temurin:21-jdk-jammy AS builder

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y --no-install-recommends curl ca-certificates git && \
    curl -fsSL "https://github.com/sbt/sbt/releases/download/v1.12.1/sbt-1.12.1.tgz" | tar xz -C /usr/local && \
    ln -sf /usr/local/sbt/bin/sbt /usr/local/bin/sbt && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /build

COPY app/project /build/project
COPY app/build.sbt /build/build.sbt
COPY app/src /build/src

RUN sbt -batch assembly

FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

ENV PORT=8080

COPY --from=builder /build/target/scala-2.13/app.jar /app/app.jar

EXPOSE 8080

USER nobody

CMD ["java", "-jar", "/app/app.jar"]

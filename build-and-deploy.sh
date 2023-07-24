#!/bin/bash
function build_and_start_local() {
    echo "Build application..."

    cp target/src/config/databases.json .
    TARGET="./target/"
    if [ -d "$TARGET" ]; then
        echo "Removing existing $TARGET directory..."
        rm -rf $TARGET
    fi

    npx tsc
    if [ $? -eq 0 ]; then
        echo "Application Build successfully"
    else
        echo "Application Build Failed Aborting"
        return 1
    fi

    cp databases.json target/src/config/
    npm run start >>logs/app.log 2>&1 &
    echo "App started check logs for current status, a.out -> for stdout logs, app.log for application logs"
}

function deployJenkins() {
    echo "Starting deployment from Jenkins to remote Server..."
}
function installnode() {
    printf "\n"
    printf "\n"
    echo "--------------------------------------------------------------------"
    echo "Installing Node JS from NVM..."


    if which node >/dev/null; then
        echo "Nodejs already installed..."
    else
        if which nvm >/dev/null; then
            echo "NVM already installed..."
        else
            echo "*******************************************************"
            echo "Installing NVM for node installation"
            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash && . ~/.nvm/nvm.sh
            echo "Installation of NVM is successful"
            echo "*******************************************************"
        fi
        echo "*******************************************************"
        echo "Installing node js and npm now with help of NVM"
        nvm install --lts
        echo "*******************************************************"

    fi

    echo "Installation Step completed :-)"
    echo "--------------------------------------------------------------------"
}

function downloaddependencies() {
    printf "\n"
    printf "\n"
    echo "--------------------------------------------------------------------"
    echo -n "Downloading Application Dependencies..."
         
    NODE_MODULES="./node_modules/"
    if [ -d "$NODE_MODULES" ]; then
        echo "Dependencies already present..."
    else
        echo "Installing required npm dependencies..."
        npm install
    fi

    echo "Dependencies installation successful :-)"
    echo "--------------------------------------------------------------------"

}


function build() {
    printf "\n"
    printf "\n"
    echo "--------------------------------------------------------------------"
    echo -n "Building Application..."
         
    TARGET="./target/"
    if [ -d "$TARGET" ]; then
        echo "Removing existing $TARGET directory..."
        rm -rf $TARGET
    fi


    downloaddependencies

    tsconfigfile="./tsconfig.json"
    printf "\n"
    printf "\n"
    echo "*******************************************************"
    echo "Checking if tsconfig.json present to build the application..."

    if [ -f "$tsconfigfile" ]; then
        echo "tsconfig.json exists. Moving forward..."
        echo "*******************************************************"

        printf "\n"
        npx tsc
        if [ $? -eq 0 ]; then
            echo "Application Build successfully ;)"
        else
            echo "Application Build Failed Aborting :("
            return 1
        fi

        cp .env target/
        

        if [[ $1 -eq "docker" ]]; then
            echo "*******************************************************"
            echo "*******************************************************"
            echo "Prepared build for Docker"
        else
            cp ./build-and-deploy.sh target/
            printf "\n"
            printf "\n"
            echo "*******************************************************"
            echo "Packaging Dependencies...."
            cp -r node_modules target/
            echo "Dependencies added :)"
            echo "*******************************************************"
            printf "\n"
            printf "\n"
        
            echo "*******************************************************"
            echo "Creating comiled zip for deployment..."
            zip -r bitspeed-backend.zip target/ > /dev/null
            echo "Compiled zip is ready for deployment..."
            echo "*******************************************************"
        fi

        printf "\n"
        printf "\n"
        
    else
        echo "tsconfig.json doesnt exists cannot build this application. Aborting :("
        echo "*******************************************************"
        return 1
    fi

    echo "Build successful :-)"
    echo "--------------------------------------------------------------------"

}


function stopApp() {
    echo "--------------------------------------------------------------------"

    echo "Shutting down app instance :-)"

    for pid in $(ps -ef | grep "index" | grep -v grep | awk '{print $2}'); 
    do 
        kill -2 $pid; 
    done

    echo "--------------------------------------------------------------------"

}


function help() {
    echo "This script is used to initialise this express app, there are several options to run this script"
    echo
    echo "Syntax: ./service-deploy.sh [start|stop|download|check|restart]"
    echo "Without options this script will install node(if not installed, already) install npm dependencies(if not present) and start the app"
    echo "options:"
    echo "start    -  starts the application"
    echo "stop     -  stops the application"
    echo "download -  downloads node dependencies"
    echo "restart  -  restart the application"
    echo "check    -  to check the application status"
}

function restart() {
    stopApp
    build_and_start_local
}

function start_docker() {
    build docker

    echo "Composing Docker MYSQL..."
    docker-compose up mysqldb > /dev/null 2>&1 &

    docker-compose up --build app

}


if [ $# -eq 0 ]; then
    installnode
    start
else
    case "$1" in "deploy-local") build_and_start_local ;;
    "stop") stopApp ;;
    "restart") restart ;;
    "build") build $2 ;;
    "start-docker") start_docker ;;
    "download") downloaddependencies ;;
    "installnode") installnode ;;
    "-h") help ;;
    "--help") help ;;
    *) echo "Invalid option. type --help for valid options." ;;
    esac
fi

#include <civetweb.h>
#include <cjson/cJSON.h>
#include "cors.h"
#include <string>
#include <iostream>
#include <signal/session_pre_key.h>
#include "../../crypto/signal.h"
#include "helpers.h"
#include "../../../../db_interface/src/dbUtils.h"

int createKeyBundle(struct mg_connection *conn, void *cbdata, char *dbPath, char* password);
int createPreKeys(struct mg_connection *conn, void *cbdata, char *dbPath, char* password);
int processKeyBundle(struct mg_connection *conn, void *cbdata, char *dbPath, char* password);
int createAccount(struct mg_connection *conn, void *cbdata, char *dbPath, char* password);
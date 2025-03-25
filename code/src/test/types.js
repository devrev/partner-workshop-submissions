/*
 * Copyright (c) 2024 DevRev Inc. All rights reserved.

Disclaimer:
The code provided herein is intended solely for testing purposes.
Under no circumstances should it be utilized in a production environment. Use of
this code in live systems, production environments, or any situation where
reliability and stability are critical is strongly discouraged. The code is
provided as-is, without any warranties or guarantees of any kind, and the user
assumes all risks associated with its use. It is the responsibility of the user
to ensure that proper testing and validation procedures are carried out before
deploying any code into production environments.
*/
/*
  Error Types
*/
export var RuntimeErrorType;
(function (RuntimeErrorType) {
    RuntimeErrorType["FunctionNotFound"] = "FUNCTION_NOT_FOUND";
    RuntimeErrorType["FunctionNameNotProvided"] = "FUNCTION_NAME_NOT_PROVIDED";
    RuntimeErrorType["InvalidRequest"] = "INVALID_REQUEST";
})(RuntimeErrorType || (RuntimeErrorType = {}));
export var SnapInsSystemUpdateRequestStatus;
(function (SnapInsSystemUpdateRequestStatus) {
    SnapInsSystemUpdateRequestStatus["Active"] = "active";
    SnapInsSystemUpdateRequestStatus["Error"] = "error";
    SnapInsSystemUpdateRequestStatus["Inactive"] = "inactive";
})(SnapInsSystemUpdateRequestStatus || (SnapInsSystemUpdateRequestStatus = {}));

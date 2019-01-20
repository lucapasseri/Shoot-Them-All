var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ErrorsHandlerService } from "./errors-handler.service";
var MatchInfoService = /** @class */ (function () {
    function MatchInfoService(http, errorsHandlerService) {
        this.http = http;
        this.errorsHandlerService = errorsHandlerService;
        this.currentMatchId = null;
    }
    MatchInfoService.prototype.setCurrentMatchId = function (matchId) {
        this.currentMatchId = matchId;
    };
    MatchInfoService.prototype.getCurrentMatchId = function () {
        return this.currentMatch;
    };
    MatchInfoService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient,
            ErrorsHandlerService])
    ], MatchInfoService);
    return MatchInfoService;
}());
export { MatchInfoService };
//# sourceMappingURL=match-info.service.js.map
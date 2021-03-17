export class InputHandler {
	static finalPoint(point, snap = true) {
		return canvas.walls /*WallsLayer*/._getWallEndpointCoordinates(point, { snap: snap });
	}
	get walls() { return canvas.walls; }
	shouldSnap(event) {
		const { originalEvent } = event.data;
		return this.walls /*WallsLayer*/._forceSnap || !originalEvent.shiftKey;
	}
	getWallEndPoint(origin, snap) {
		// Determine the starting coordinates
		return new PIXI.Point(...this.walls /*WallsLayer*/._getWallEndpointCoordinates(origin, { snap }));
	}
}
export class InitializerInputHandler extends InputHandler {
	constructor(lineA, lineB, success, fail) {
		super();
		this.lineA = lineA;
		this.lineB = lineB;
		this.success = success;
		this.fail = fail;
	}
	start(origin, destination, event) {
		const snap = this.shouldSnap(event);
		this.lineA.copyFrom(this.getWallEndPoint(origin, snap));
		this.lineB.copyFrom(this.getWallEndPoint(destination, snap));
	}
	move(_origin, destination, event) {
		this.lineB.copyFrom(this.getWallEndPoint(destination, this.shouldSnap(event)));
	}
	stop(_origin, destination, event) {
		this.lineB.copyFrom(this.getWallEndPoint(destination, this.shouldSnap(event)));
		this.success();
	}
	cancel() {
		this.fail();
	}
}
export class PointInputHandler extends InputHandler {
	constructor(point, completion = null) {
		super();
		this.originalPoint = new PIXI.Point(0, 0);
		this.completion = null;
		this.originalPoint.copyFrom(point);
		this.point = point;
		this.completion = completion;
	}
	start(_origin, destination, event) {
		this.move(null, destination, event);
	}
	move(_origin, destination, event) {
		this.point.copyFrom(this.getWallEndPoint(destination, this.shouldSnap(event)));
	}
	stop(_origin, destination, event) {
		this.point.copyFrom(this.getWallEndPoint(destination, this.shouldSnap(event)));
		if (this.completion != null)
			this.completion(this);
	}
	cancel() {
		this.point.copyFrom(this.originalPoint);
		if (this.completion != null)
			this.completion(this);
	}
}
export class PointArrayInputHandler extends InputHandler {
	constructor(start, points, completion = null) {
		super();
		this.originalPoints = [];
		points.forEach(e => this.originalPoints.push(e.clone()));
		this.points = points;
		this._start = start;
		this.completion = completion;
	}
	moveAll(to, event) {
		const delta = new PIXI.Point(to.x - this._start.x, to.y - this._start.y);
		const snap = this.shouldSnap(event);
		var o;
		this.points.forEach((e, i) => {
			o = this.originalPoints[i];
			e.copyFrom(this.getWallEndPoint(new PIXI.Point(o.x + delta.x, o.y + delta.y), snap));
		});
	}
	start(_origin, destination, event) {
		this.moveAll(destination, event);
	}
	move(_origin, destination, event) {
		this.moveAll(destination, event);
	}
	stop(_origin, destination, event) {
		this.moveAll(destination, event);
		if (this.completion != null)
			this.completion(this);
	}
	cancel() {
		this.originalPoints.forEach((e, i) => e.copyTo(this.points[i]));
		if (this.completion != null)
			this.completion(this);
	}
}
export class MagnetPointInputHandler extends InputHandler {
	constructor(masterPoint, slavePoint, completion = null) {
		super();
		this.originalPoint = new PIXI.Point(0, 0);
		this.completion = null;
		this.originalPoint.copyFrom(masterPoint);
		this.masterPoint = masterPoint;
		this.slavePoint = slavePoint;
		this.offsetX = slavePoint.x - masterPoint.x;
		this.offsetY = slavePoint.y - masterPoint.y;
		this.completion = completion;
	}
	start(_origin, destination, event) {
		this.move(null, destination, event);
	}
	move(_origin, destination, event) {
		this.masterPoint.copyFrom(this.getWallEndPoint(destination, this.shouldSnap(event)));
		this.slavePoint.set(this.masterPoint.x + this.offsetX, this.masterPoint.y + this.offsetY);
	}
	stop(_origin, destination, event) {
		this.masterPoint.copyFrom(this.getWallEndPoint(destination, this.shouldSnap(event)));
		this.slavePoint.set(this.masterPoint.x + this.offsetX, this.masterPoint.y + this.offsetY);
		if (this.completion != null)
			this.completion(this);
	}
	cancel() {
		this.masterPoint.copyFrom(this.originalPoint);
		this.slavePoint.set(this.masterPoint.x + this.offsetX, this.masterPoint.y + this.offsetY);
		if (this.completion != null)
			this.completion(this);
	}
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2RmLWN1cnZ5LXdhbGxzL3NyYy90b29scy9Ub29sSW5wdXRIYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE1BQU0sT0FBZ0IsWUFBWTtJQUtqQyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQVksRUFBRSxPQUFnQixJQUFJO1FBQ25ELE9BQVMsTUFBYyxDQUFDLEtBQVksQ0FBQSxjQUFlLENBQUMsMkJBQTJCLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDeEcsQ0FBQztJQUVELElBQWMsS0FBSyxLQUFpQixPQUFRLE1BQWMsQ0FBQyxLQUFtQixDQUFDLENBQUMsQ0FBQztJQUVqRixVQUFVLENBQUMsS0FBNEI7UUFDdEMsTUFBTSxFQUFFLGFBQWEsRUFBRSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDckMsT0FBUSxJQUFJLENBQUMsS0FBWSxDQUFBLGNBQWUsQ0FBQyxVQUFVLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDO0lBQ2hGLENBQUM7SUFFRCxlQUFlLENBQUMsTUFBa0IsRUFBRSxJQUFhO1FBQ2hELHFDQUFxQztRQUNyQyxPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFJLElBQUksQ0FBQyxLQUFZLENBQUEsY0FBZSxDQUFDLDJCQUEyQixDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMzRyxDQUFDO0NBQ0Q7QUFFRCxNQUFNLE9BQWdCLHVCQUF3QixTQUFRLFlBQVk7SUFLakUsWUFBWSxLQUFZLEVBQUUsS0FBWSxFQUFFLE9BQW1CLEVBQUUsSUFBZ0I7UUFDNUUsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENB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SUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJO1lBQzFCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUNELE1BQU07UUFDTCxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDekYsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUk7WUFDMUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QixDQUFDO0NBQ0QiLCJmaWxlIjoidG9vbHMvVG9vbElucHV0SGFuZGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlY2xhcmUgdHlwZSBQb2ludCA9IFBJWEkuUG9pbnQ7XG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSW5wdXRIYW5kbGVyIHtcblx0YWJzdHJhY3Qgc3RhcnQob3JpZ2luOiBQb2ludCwgZGVzdGluYXRpb246IFBvaW50LCBldmVudDogUElYSS5JbnRlcmFjdGlvbkV2ZW50KTogdm9pZDtcblx0YWJzdHJhY3QgbW92ZShvcmlnaW46IFBvaW50LCBkZXN0aW5hdGlvbjogUG9pbnQsIGV2ZW50OiBQSVhJLkludGVyYWN0aW9uRXZlbnQpOiB2b2lkO1xuXHRhYnN0cmFjdCBzdG9wKG9yaWdpbjogUG9pbnQsIGRlc3RpbmF0aW9uOiBQb2ludCwgZXZlbnQ6IFBJWEkuSW50ZXJhY3Rpb25FdmVudCk6IHZvaWQ7XG5cdGFic3RyYWN0IGNhbmNlbCgpOiB2b2lkO1xuXHRzdGF0aWMgZmluYWxQb2ludChwb2ludDogUG9pbnQsIHNuYXA6IGJvb2xlYW4gPSB0cnVlKSB7XG5cdFx0cmV0dXJuICgoY2FudmFzIGFzIGFueSkud2FsbHMgYXMgYW55LypXYWxsc0xheWVyKi8pLl9nZXRXYWxsRW5kcG9pbnRDb29yZGluYXRlcyhwb2ludCwgeyBzbmFwOiBzbmFwIH0pO1xuXHR9XG5cblx0cHJvdGVjdGVkIGdldCB3YWxscygpOiBXYWxsc0xheWVyIHsgcmV0dXJuIChjYW52YXMgYXMgYW55KS53YWxscyBhcyBXYWxsc0xheWVyOyB9XG5cblx0c2hvdWxkU25hcChldmVudDogUElYSS5JbnRlcmFjdGlvbkV2ZW50KSB7XG5cdFx0Y29uc3QgeyBvcmlnaW5hbEV2ZW50IH0gPSBldmVudC5kYXRhO1xuXHRcdHJldHVybiAodGhpcy53YWxscyBhcyBhbnkvKldhbGxzTGF5ZXIqLykuX2ZvcmNlU25hcCB8fCAhb3JpZ2luYWxFdmVudC5zaGlmdEtleTtcblx0fVxuXG5cdGdldFdhbGxFbmRQb2ludChvcmlnaW46IFBJWEkuUG9pbnQsIHNuYXA6IGJvb2xlYW4pOiBQSVhJLlBvaW50IHtcblx0XHQvLyBEZXRlcm1pbmUgdGhlIHN0YXJ0aW5nIGNvb3JkaW5hdGVzXG5cdFx0cmV0dXJuIG5ldyBQSVhJLlBvaW50KC4uLih0aGlzLndhbGxzIGFzIGFueS8qV2FsbHNMYXllciovKS5fZ2V0V2FsbEVuZHBvaW50Q29vcmRpbmF0ZXMob3JpZ2luLCB7IHNuYXAgfSkpO1xuXHR9XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBJbml0aWFsaXplcklucHV0SGFuZGxlciBleHRlbmRzIElucHV0SGFuZGxlciB7XG5cdGxpbmVBOiBQb2ludDtcblx0bGluZUI6IFBvaW50O1xuXHRwcml2YXRlIHN1Y2Nlc3M6ICgpID0+IHZvaWQ7XG5cdHByaXZhdGUgZmFpbDogKCkgPT4gdm9pZDtcblx0Y29uc3RydWN0b3IobGluZUE6IFBvaW50LCBsaW5lQjogUG9pbnQsIHN1Y2Nlc3M6ICgpID0+IHZvaWQsIGZhaWw6ICgpID0+IHZvaWQpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMubGluZUEgPSBsaW5lQTtcblx0XHR0aGlzLmxpbmVCID0gbGluZUI7XG5cdFx0dGhpcy5zdWNjZXNzID0gc3VjY2Vzcztcblx0XHR0aGlzLmZhaWwgPSBmYWlsO1xuXHR9XG5cdHN0YXJ0KG9yaWdpbjogUG9pbnQsIGRlc3RpbmF0aW9uOiBQb2ludCwgZXZlbnQ6IFBJWEkuSW50ZXJhY3Rpb25FdmVudCkge1xuXHRcdGNvbnN0IHNuYXAgPSB0aGlzLnNob3VsZFNuYXAoZXZlbnQpO1xuXHRcdHRoaXMubGluZUEuY29weUZyb20odGhpcy5nZXRXYWxsRW5kUG9pbnQob3JpZ2luLCBzbmFwKSBhcyBQSVhJLlBvaW50KTtcblx0XHR0aGlzLmxpbmVCLmNvcHlGcm9tKHRoaXMuZ2V0V2FsbEVuZFBvaW50KGRlc3RpbmF0aW9uLCBzbmFwKSBhcyBQSVhJLlBvaW50KTtcblx0fVxuXHRtb3ZlKF9vcmlnaW46IFBvaW50LCBkZXN0aW5hdGlvbjogUG9pbnQsIGV2ZW50OiBQSVhJLkludGVyYWN0aW9uRXZlbnQpOiB2b2lkIHtcblx0XHR0aGlzLmxpbmVCLmNvcHlGcm9tKHRoaXMuZ2V0V2FsbEVuZFBvaW50KGRlc3RpbmF0aW9uLCB0aGlzLnNob3VsZFNuYXAoZXZlbnQpKSBhcyBQSVhJLlBvaW50KTtcblx0fVxuXHRzdG9wKF9vcmlnaW46IFBvaW50LCBkZXN0aW5hdGlvbjogUG9pbnQsIGV2ZW50OiBQSVhJLkludGVyYWN0aW9uRXZlbnQpOiB2b2lkIHtcblx0XHR0aGlzLmxpbmVCLmNvcHlGcm9tKHRoaXMuZ2V0V2FsbEVuZFBvaW50KGRlc3RpbmF0aW9uLCB0aGlzLnNob3VsZFNuYXAoZXZlbnQpKSBhcyBQSVhJLlBvaW50KTtcblx0XHR0aGlzLnN1Y2Nlc3MoKTtcblx0fVxuXHRjYW5jZWwoKSB7XG5cdFx0dGhpcy5mYWlsKCk7XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIFBvaW50SW5wdXRIYW5kbGVyIGV4dGVuZHMgSW5wdXRIYW5kbGVyIHtcblx0cHJpdmF0ZSBvcmlnaW5hbFBvaW50ID0gbmV3IFBJWEkuUG9pbnQoMCwgMCk7XG5cdHBvaW50OiBQb2ludDtcblx0Y29tcGxldGlvbj86IChzZW5kZXI6IFBvaW50SW5wdXRIYW5kbGVyKSA9PiB2b2lkID0gbnVsbDtcblx0Y29uc3RydWN0b3IocG9pbnQ6IFBvaW50LCBjb21wbGV0aW9uOiAoc2VuZGVyOiBQb2ludElucHV0SGFuZGxlcikgPT4gdm9pZCA9IG51bGwpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMub3JpZ2luYWxQb2ludC5jb3B5RnJvbShwb2ludCk7XG5cdFx0dGhpcy5wb2ludCA9IHBvaW50O1xuXHRcdHRoaXMuY29tcGxldGlvbiA9IGNvbXBsZXRpb247XG5cdH1cblx0c3RhcnQoX29yaWdpbjogUG9pbnQsIGRlc3RpbmF0aW9uOiBQb2ludCwgZXZlbnQ6IFBJWEkuSW50ZXJhY3Rpb25FdmVudCk6IHZvaWQge1xuXHRcdHRoaXMubW92ZShudWxsLCBkZXN0aW5hdGlvbiwgZXZlbnQpO1xuXHR9XG5cdG1vdmUoX29yaWdpbjogUG9pbnQsIGRlc3RpbmF0aW9uOiBQb2ludCwgZXZlbnQ6IFBJWEkuSW50ZXJhY3Rpb25FdmVudCk6IHZvaWQge1xuXHRcdHRoaXMucG9pbnQuY29weUZyb20odGhpcy5nZXRXYWxsRW5kUG9pbnQoZGVzdGluYXRpb24sIHRoaXMuc2hvdWxkU25hcChldmVudCkpIGFzIFBJWEkuUG9pbnQpO1xuXHR9XG5cdHN0b3AoX29yaWdpbjogUG9pbnQsIGRlc3RpbmF0aW9uOiBQb2ludCwgZXZlbnQ6IFBJWEkuSW50ZXJhY3Rpb25FdmVudCk6IHZvaWQge1xuXHRcdHRoaXMucG9pbnQuY29weUZyb20odGhpcy5nZXRXYWxsRW5kUG9pbnQoZGVzdGluYXRpb24sIHRoaXMuc2hvdWxkU25hcChldmVudCkpIGFzIFBJWEkuUG9pbnQpO1xuXHRcdGlmICh0aGlzLmNvbXBsZXRpb24gIT0gbnVsbClcblx0XHRcdHRoaXMuY29tcGxldGlvbih0aGlzKTtcblx0fVxuXHRjYW5jZWwoKSB7XG5cdFx0dGhpcy5wb2ludC5jb3B5RnJvbSh0aGlzLm9yaWdpbmFsUG9pbnQpO1xuXHRcdGlmICh0aGlzLmNvbXBsZXRpb24gIT0gbnVsbClcblx0XHRcdHRoaXMuY29tcGxldGlvbih0aGlzKTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgUG9pbnRBcnJheUlucHV0SGFuZGxlciBleHRlbmRzIElucHV0SGFuZGxlciB7XG5cdHByaXZhdGUgb3JpZ2luYWxQb2ludHM6IFBvaW50W10gPSBbXTtcblx0cG9pbnRzOiBQSVhJLlBvaW50W107XG5cdHByaXZhdGUgX3N0YXJ0OiBQb2ludDtcblx0Y29tcGxldGlvbjogKHNlbmRlcjogUG9pbnRBcnJheUlucHV0SGFuZGxlcikgPT4gdm9pZDtcblx0Y29uc3RydWN0b3Ioc3RhcnQ6IFBvaW50LCBwb2ludHM6IFBvaW50W10sIGNvbXBsZXRpb246IChzZW5kZXI6IFBvaW50QXJyYXlJbnB1dEhhbmRsZXIpID0+IHZvaWQgPSBudWxsKSB7XG5cdFx0c3VwZXIoKTtcblx0XHRwb2ludHMuZm9yRWFjaChlID0+IHRoaXMub3JpZ2luYWxQb2ludHMucHVzaChlLmNsb25lKCkpKTtcblx0XHR0aGlzLnBvaW50cyA9IHBvaW50cztcblx0XHR0aGlzLl9zdGFydCA9IHN0YXJ0O1xuXHRcdHRoaXMuY29tcGxldGlvbiA9IGNvbXBsZXRpb247XG5cdH1cblx0cHJpdmF0ZSBtb3ZlQWxsKHRvOiBQb2ludCwgZXZlbnQ6IFBJWEkuSW50ZXJhY3Rpb25FdmVudCkge1xuXHRcdGNvbnN0IGRlbHRhID0gbmV3IFBJWEkuUG9pbnQodG8ueCAtIHRoaXMuX3N0YXJ0LngsIHRvLnkgLSB0aGlzLl9zdGFydC55KTtcblx0XHRjb25zdCBzbmFwID0gdGhpcy5zaG91bGRTbmFwKGV2ZW50KTtcblx0XHR2YXIgbzogUElYSS5Qb2ludDtcblx0XHR0aGlzLnBvaW50cy5mb3JFYWNoKChlLCBpKSA9PiB7XG5cdFx0XHRvID0gdGhpcy5vcmlnaW5hbFBvaW50c1tpXTtcblx0XHRcdGUuY29weUZyb20odGhpcy5nZXRXYWxsRW5kUG9pbnQobmV3IFBJWEkuUG9pbnQoby54ICsgZGVsdGEueCwgby55ICsgZGVsdGEueSksIHNuYXApKTtcblx0XHR9KVxuXHR9XG5cdHN0YXJ0KF9vcmlnaW46IFBvaW50LCBkZXN0aW5hdGlvbjogUG9pbnQsIGV2ZW50OiBQSVhJLkludGVyYWN0aW9uRXZlbnQpOiB2b2lkIHtcblx0XHR0aGlzLm1vdmVBbGwoZGVzdGluYXRpb24sIGV2ZW50KTtcblx0fVxuXHRtb3ZlKF9vcmlnaW46IFBvaW50LCBkZXN0aW5hdGlvbjogUG9pbnQsIGV2ZW50OiBQSVhJLkludGVyYWN0aW9uRXZlbnQpOiB2b2lkIHtcblx0XHR0aGlzLm1vdmVBbGwoZGVzdGluYXRpb24sIGV2ZW50KTtcblx0fVxuXHRzdG9wKF9vcmlnaW46IFBvaW50LCBkZXN0aW5hdGlvbjogUG9pbnQsIGV2ZW50OiBQSVhJLkludGVyYWN0aW9uRXZlbnQpOiB2b2lkIHtcblx0XHR0aGlzLm1vdmVBbGwoZGVzdGluYXRpb24sIGV2ZW50KTtcblx0XHRpZiAodGhpcy5jb21wbGV0aW9uICE9IG51bGwpXG5cdFx0XHR0aGlzLmNvbXBsZXRpb24odGhpcyk7XG5cdH1cblx0Y2FuY2VsKCkge1xuXHRcdHRoaXMub3JpZ2luYWxQb2ludHMuZm9yRWFjaCgoZSwgaSkgPT4gZS5jb3B5VG8odGhpcy5wb2ludHNbaV0pKTtcblx0XHRpZiAodGhpcy5jb21wbGV0aW9uICE9IG51bGwpXG5cdFx0XHR0aGlzLmNvbXBsZXRpb24odGhpcyk7XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIE1hZ25ldFBvaW50SW5wdXRIYW5kbGVyIGV4dGVuZHMgSW5wdXRIYW5kbGVyIHtcblx0cHJpdmF0ZSBvcmlnaW5hbFBvaW50ID0gbmV3IFBJWEkuUG9pbnQoMCwgMCk7XG5cdHByb3RlY3RlZCBtYXN0ZXJQb2ludDogUG9pbnQ7XG5cdHByb3RlY3RlZCBzbGF2ZVBvaW50OiBQb2ludDtcblx0cHJvdGVjdGVkIG9mZnNldFg6IG51bWJlcjtcblx0cHJvdGVjdGVkIG9mZnNldFk6IG51bWJlcjtcblx0Y29tcGxldGlvbj86IChzZW5kZXI6IE1hZ25ldFBvaW50SW5wdXRIYW5kbGVyKSA9PiB2b2lkID0gbnVsbDtcblx0Y29uc3RydWN0b3IobWFzdGVyUG9pbnQ6IFBvaW50LCBzbGF2ZVBvaW50OiBQb2ludCwgY29tcGxldGlvbjogKHNlbmRlcjogTWFnbmV0UG9pbnRJbnB1dEhhbmRsZXIpID0+IHZvaWQgPSBudWxsKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLm9yaWdpbmFsUG9pbnQuY29weUZyb20obWFzdGVyUG9pbnQpO1xuXHRcdHRoaXMubWFzdGVyUG9pbnQgPSBtYXN0ZXJQb2ludDtcblx0XHR0aGlzLnNsYXZlUG9pbnQgPSBzbGF2ZVBvaW50O1xuXHRcdHRoaXMub2Zmc2V0WCA9IHNsYXZlUG9pbnQueCAtIG1hc3RlclBvaW50Lng7XG5cdFx0dGhpcy5vZmZzZXRZID0gc2xhdmVQb2ludC55IC0gbWFzdGVyUG9pbnQueTtcblx0XHR0aGlzLmNvbXBsZXRpb24gPSBjb21wbGV0aW9uO1xuXHR9XG5cdHN0YXJ0KF9vcmlnaW46IFBvaW50LCBkZXN0aW5hdGlvbjogUG9pbnQsIGV2ZW50OiBQSVhJLkludGVyYWN0aW9uRXZlbnQpOiB2b2lkIHtcblx0XHR0aGlzLm1vdmUobnVsbCwgZGVzdGluYXRpb24sIGV2ZW50KTtcblx0fVxuXHRtb3ZlKF9vcmlnaW46IFBvaW50LCBkZXN0aW5hdGlvbjogUG9pbnQsIGV2ZW50OiBQSVhJLkludGVyYWN0aW9uRXZlbnQpOiB2b2lkIHtcblx0XHR0aGlzLm1hc3RlclBvaW50LmNvcHlGcm9tKHRoaXMuZ2V0V2FsbEVuZFBvaW50KGRlc3RpbmF0aW9uLCB0aGlzLnNob3VsZFNuYXAoZXZlbnQpKSBhcyBQSVhJLlBvaW50KTtcblx0XHR0aGlzLnNsYXZlUG9pbnQuc2V0KHRoaXMubWFzdGVyUG9pbnQueCArIHRoaXMub2Zmc2V0WCwgdGhpcy5tYXN0ZXJQb2ludC55ICsgdGhpcy5vZmZzZXRZKVxuXHR9XG5cdHN0b3AoX29yaWdpbjogUG9pbnQsIGRlc3RpbmF0aW9uOiBQb2ludCwgZXZlbnQ6IFBJWEkuSW50ZXJhY3Rpb25FdmVudCk6IHZvaWQge1xuXHRcdHRoaXMubWFzdGVyUG9pbnQuY29weUZyb20odGhpcy5nZXRXYWxsRW5kUG9pbnQoZGVzdGluYXRpb24sIHRoaXMuc2hvdWxkU25hcChldmVudCkpIGFzIFBJWEkuUG9pbnQpO1xuXHRcdHRoaXMuc2xhdmVQb2ludC5zZXQodGhpcy5tYXN0ZXJQb2ludC54ICsgdGhpcy5vZmZzZXRYLCB0aGlzLm1hc3RlclBvaW50LnkgKyB0aGlzLm9mZnNldFkpXG5cdFx0aWYgKHRoaXMuY29tcGxldGlvbiAhPSBudWxsKVxuXHRcdFx0dGhpcy5jb21wbGV0aW9uKHRoaXMpO1xuXHR9XG5cdGNhbmNlbCgpIHtcblx0XHR0aGlzLm1hc3RlclBvaW50LmNvcHlGcm9tKHRoaXMub3JpZ2luYWxQb2ludCk7XG5cdFx0dGhpcy5zbGF2ZVBvaW50LnNldCh0aGlzLm1hc3RlclBvaW50LnggKyB0aGlzLm9mZnNldFgsIHRoaXMubWFzdGVyUG9pbnQueSArIHRoaXMub2Zmc2V0WSlcblx0XHRpZiAodGhpcy5jb21wbGV0aW9uICE9IG51bGwpXG5cdFx0XHR0aGlzLmNvbXBsZXRpb24odGhpcyk7XG5cdH1cbn0iXX0=
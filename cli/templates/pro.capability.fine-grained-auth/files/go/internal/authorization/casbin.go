package authorization

import (
	"net/http"
	"sync"

	"example.com/{{projectName}}/internal/auth"
	"github.com/casbin/casbin/v2"
	"github.com/casbin/casbin/v2/model"
	"github.com/gin-gonic/gin"
)

var (
	enforcerOnce sync.Once
	enforcer     *casbin.Enforcer
)

func policyEnforcer() *casbin.Enforcer {
	enforcerOnce.Do(func() {
		modelDefinition := model.NewModel()
		modelDefinition.AddDef("r", "r", "sub, obj, act")
		modelDefinition.AddDef("p", "p", "sub, obj, act")
		modelDefinition.AddDef("e", "e", "some(where (p_eft == allow))")
		modelDefinition.AddDef("m", "m", "r.sub == p.sub && r.obj == p.obj && r.act == p.act")
		enforcer, _ = casbin.NewEnforcer(modelDefinition)
		_, _ = enforcer.AddPolicy("admin", "admin", "read")
	})
	return enforcer
}

func Require(resource string, action string) gin.HandlerFunc {
	return func(c *gin.Context) {
		allowed, err := policyEnforcer().Enforce(c.GetString(auth.SubjectKey), resource, action)
		if err != nil || !allowed {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "forbidden"})
			return
		}
		c.Next()
	}
}

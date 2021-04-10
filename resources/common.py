from flask import g


def standard_resource_class(namespace,marshal_model, query, as_list = True):
    class Dummy():
        @namespace.marshal_with(marshal_model, as_list=as_list)
        def get(self):
            return self._get()
        def _get(self):
            db_resource = query.with_session(g.session).all()
            dict_result = []
            for x in db_resource:
                dict_result.append(x._asdict())
            print(db_resource)
            return dict_result,200
    return Dummy
